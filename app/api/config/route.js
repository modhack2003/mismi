import { NextResponse } from 'next/server';
import { createClient } from 'redis';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Define the redis instance lazily to gracefully fail early versions of Next
let redisClient = null;
let isConnected = false;

async function getRedisClient() {
  if (isConnected && redisClient) {
    return redisClient;
  }
  
  try {
    if (process.env.REDIS_URL) {
      redisClient = createClient({ url: process.env.REDIS_URL });
      redisClient.on('error', (err) => console.warn('Redis Client Error', err));
      await redisClient.connect();
      isConnected = true;
      return redisClient;
    }
  } catch(e) {
    console.warn("Failed to connect to Redis", e);
  }
  return null;
}

export async function GET() {
  try {
    // 1. Attempt to fetch from Redis Database First
    const redis = await getRedisClient();
    if (redis) {
      const kvData = await redis.get('appConfig');
      if (kvData) {
        return NextResponse.json(JSON.parse(kvData));
      }
    }
  } catch (error) {
    console.warn("Redis fetch failed (might just be unconfigured locally). Falling back to JSON...", error.message);
  }

  // 2. Fallback to reading the local JSON file on first boot or missing .env
  try {
    const configPath = path.join(process.cwd(), 'data', 'config.json');
    const data = fs.readFileSync(configPath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: 'System configuration not found entirely' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newData = await request.json();
    
    if (!newData || !newData.photoStory) {
      return NextResponse.json({ error: 'Invalid config payload received' }, { status: 400 });
    }

    try {
      // 1. Attempt to write changes to Redis Database
      const redis = await getRedisClient();
      if (redis) {
        await redis.set('appConfig', JSON.stringify(newData));
        console.log("Successfully cached to Redis database");
      } else {
         throw new Error("Redis module is not initialized");
      }

      // Optional: Since they are local, try to write file too so Github syncs
      if (process.env.NODE_ENV !== 'production') {
        const configPath = path.join(process.cwd(), 'data', 'config.json');
        fs.writeFileSync(configPath, JSON.stringify(newData, null, 2), 'utf8');
      }

    } catch(kvError) {
      console.warn("Redis POST failed! Saving locally instead...", kvError.message);
      
      // 2. Fallback local save (only works if not Deployed on Serverless)
      const configPath = path.join(process.cwd(), 'data', 'config.json');
      fs.writeFileSync(configPath, JSON.stringify(newData, null, 2), 'utf8');
    }

    return NextResponse.json({ success: true, message: 'Config successfully captured!' });
  } catch (error) {
    console.error("Critical Save Error:", error);
    return NextResponse.json({ error: 'Failed to write config state' }, { status: 500 });
  }
}
