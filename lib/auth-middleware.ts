import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from './firebase-admin';

export async function verifyAuthToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No valid authorization header', status: 401 };
    }

    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      return { error: 'No token provided', status: 401 };
    }

    // Check if Firebase Admin is properly initialized
    if (!adminAuth) {
      console.warn('Firebase Admin not initialized, skipping token verification for development');
      // In development mode, allow access with a mock user
      if (process.env.NODE_ENV === 'development') {
        return {
          user: {
            uid: 'dev-user',
            email: 'dev@example.com',
            emailVerified: true
          },
          status: 200
        };
      }
      return { error: 'Firebase Admin not configured', status: 500 };
    }

    // Verify the token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    return { 
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      },
      status: 200 
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return { error: 'Invalid token', status: 401 };
  }
}

export function createAuthResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

// Middleware function for protecting API routes
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  const authResult = await verifyAuthToken(request);
  
  if (authResult.error) {
    return createAuthResponse(authResult.error, authResult.status);
  }
  
  return handler(request, authResult.user);
}