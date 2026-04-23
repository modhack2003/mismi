import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file'); // Can be a File object
    const url = formData.get('url');   // Remote URL (like Instagram)

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json({ error: 'Cloudinary environment variables are missing! Check your .env.local' }, { status: 500 });
    }

    let uploadResult;

    if (file && typeof file !== 'string') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'pukuli_app', resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
    } else if (url) {
      // Direct pass to Cloudinary. It will attempt to fetch and upload it.
      uploadResult = await cloudinary.uploader.upload(url, { folder: 'pukuli_app', resource_type: 'auto' });
    } else {
      return NextResponse.json({ error: 'No file or valid URL provided' }, { status: 400 });
    }

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: 'Upload failed: ' + (error.message || 'Unknown error occurred.') }, { status: 500 });
  }
}
