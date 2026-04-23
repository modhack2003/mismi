import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const track = searchParams.get('track');
  const artist = searchParams.get('artist');

  if (!track) {
    return NextResponse.json({ error: 'Missing track name' }, { status: 400 });
  }

  try {
    let url = `https://lrclib.net/api/search?track_name=${encodeURIComponent(track)}`;
    if (artist) {
      url += `&artist_name=${encodeURIComponent(artist)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch lyrics');
    }

    const data = await response.json();
    if (data && data.length > 0) {
      // Prefer plainLyrics for simple typewriter, but fallback to anything
      const lyrics = data[0].plainLyrics || data[0].syncedLyrics;
      if (lyrics) {
        return NextResponse.json({ lyrics });
      }
    }
    
    return NextResponse.json({ error: 'No lyrics found for this track' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
