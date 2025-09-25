import { NextRequest, NextResponse } from 'next/server';
import { 
  getResource, 
  updateResource, 
  deleteResource,
  Resource 
} from '@/lib/firestore';

// GET /api/resources/[id] - Get a specific resource
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await getResource(params.id);
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      { error: 'Resource not found' },
      { status: 404 }
    );
  }
}

// PUT /api/resources/[id] - Update a specific resource
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate mediaType if provided
    if (body.mediaType && !['image', 'video'].includes(body.mediaType)) {
      return NextResponse.json(
        { error: 'mediaType must be either "image" or "video"' },
        { status: 400 }
      );
    }

    // Validate category if provided
    if (body.category && !['web', 'app', 'design', 'development'].includes(body.category)) {
      return NextResponse.json(
        { error: 'category must be one of: web, app, design, development' },
        { status: 400 }
      );
    }

    // Create update object with only provided fields
    const updates: Partial<Resource> = {};
    
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.mediaUrl !== undefined) updates.mediaUrl = body.mediaUrl;
    if (body.mediaType !== undefined) updates.mediaType = body.mediaType;
    if (body.category !== undefined) updates.category = body.category;
    if (body.tags !== undefined) updates.tags = Array.isArray(body.tags) ? body.tags : [];
    if (body.resourceUrl !== undefined) updates.resourceUrl = body.resourceUrl;
    if (body.isPublished !== undefined) updates.isPublished = body.isPublished;
    if (body.featured !== undefined) updates.featured = body.featured;

    await updateResource(params.id, updates);

    return NextResponse.json({ message: 'Resource updated successfully' });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/[id] - Delete a specific resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteResource(params.id);
    return NextResponse.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}