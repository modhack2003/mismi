import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  try {
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`;
    const res = await fetch(itunesUrl);
    const data = await res.json();

    const formattedTracks = data.results.map(track => ({
      id: track.trackId,
      trackName: track.trackName,
      artist: track.artistName,
      audioUrl: track.previewUrl,
      artworkUrl: track.artworkUrl100
    }));

    return NextResponse.json({ results: formattedTracks });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
