import { NextRequest, NextResponse } from 'next/server';
import { getPublishedResourcesAdmin } from '@/lib/firestore-admin';

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

    const result = await getPublishedResourcesAdmin(category, query, 100);
    const resources = result.resources;

    return NextResponse.json({ resources, query, category });
  } catch (error) {
    console.error('Error searching resources:', error);
    return NextResponse.json(
      { error: 'Failed to search resources' },
      { status: 500 }
    );
  }
}