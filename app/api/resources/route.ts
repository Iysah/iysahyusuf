import { NextRequest, NextResponse } from 'next/server';
import { 
  getPublishedResources, 
  createResource,
  Resource 
} from '@/lib/firestore';
import { 
  getAllResourcesAdmin,
  getPublishedResourcesAdmin,
  createResourceAdmin
} from '@/lib/firestore-admin';
import { verifyAuthToken } from '@/lib/auth-middleware';

// GET /api/resources - Get all published resources with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '12');
    const admin = searchParams.get('admin') === 'true';

    let resources;

    if (admin) {
      // For admin, verify authentication
      const authResult = await verifyAuthToken(request);
      if (authResult.error) {
        return NextResponse.json(
          { error: authResult.error },
          { status: authResult.status }
        );
      }
      
      // Get all resources for authenticated admin
      resources = await getAllResourcesAdmin();
      return NextResponse.json({ resources });
    } else {
      // For public, get published resources with filtering
      const result = await getPublishedResources(category, search, limit);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create a new resource
export async function POST(request: NextRequest) {
  try {
    // Verify authentication for creating resources
    const authResult = await verifyAuthToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'mediaUrl', 'mediaType', 'category', 'resourceUrl'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate mediaType
    if (!['image', 'video'].includes(body.mediaType)) {
      return NextResponse.json(
        { error: 'mediaType must be either "image" or "video"' },
        { status: 400 }
      );
    }

    // Validate category
    if (!['web', 'app', 'design', 'development'].includes(body.category)) {
      return NextResponse.json(
        { error: 'category must be one of: web, app, design, development' },
        { status: 400 }
      );
    }

    // Create resource object
    const resourceData: Omit<Resource, 'id' | 'createdAt'> = {
      title: body.title,
      description: body.description,
      mediaUrl: body.mediaUrl,
      mediaType: body.mediaType,
      category: body.category,
      tags: Array.isArray(body.tags) ? body.tags : [],
      resourceUrl: body.resourceUrl,
      isPublished: body.isPublished || false,
      featured: body.featured || false,
    };

    const resourceId = await createResourceAdmin(resourceData);

    return NextResponse.json(
      { id: resourceId, message: 'Resource created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}