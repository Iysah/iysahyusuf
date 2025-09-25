import { NextRequest, NextResponse } from 'next/server';
import { searchResources } from '@/lib/firestore';

// GET /api/resources/search - Search resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category') || undefined;

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const resources = await searchResources(query, category);

    return NextResponse.json({ resources, query, category });
  } catch (error) {
    console.error('Error searching resources:', error);
    return NextResponse.json(
      { error: 'Failed to search resources' },
      { status: 500 }
    );
  }
}