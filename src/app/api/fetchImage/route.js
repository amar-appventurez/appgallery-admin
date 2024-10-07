import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('imageUrl');

  if (!imageUrl) {
    return NextResponse.json({ error: 'No image URL provided' }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }

    const blob = await response.blob();

    return new NextResponse(blob.stream(), {
      headers: {
        'Content-Type': blob.type,
        'Content-Disposition': `attachment; filename=${imageUrl.split('/').pop()}`,
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ error: 'Error fetching image' }, { status: 500 });
  }
}
