import { adminDb } from './firebase-admin';
import { Resource } from './firestore';

// Server-side Firestore functions using Firebase Admin SDK
// These bypass security rules and are meant for API routes only

const RESOURCES_COLLECTION = 'resources';

// Get all resources (admin only)
export async function getAllResourcesAdmin(): Promise<Resource[]> {
  try {
    if (!adminDb) {
      console.warn('Firebase Admin not initialized, returning empty array');
      return [];
    }

    const snapshot = await adminDb
      .collection(RESOURCES_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();

    const resources: Resource[] = [];
    snapshot.forEach((doc: any) => {
      resources.push({
        id: doc.id,
        ...doc.data()
      } as Resource);
    });

    return resources;
  } catch (error) {
    console.error('Error fetching all resources (admin):', error);
    throw error;
  }
}

// Get published resources (public)
export async function getPublishedResourcesAdmin(
  categoryFilter?: string,
  searchTerm?: string,
  limitCount: number = 12
): Promise<{ resources: Resource[]; hasMore: boolean }> {
  try {
    if (!adminDb) {
      console.warn('Firebase Admin not initialized, returning empty array');
      return { resources: [], hasMore: false };
    }

    let query = adminDb
      .collection(RESOURCES_COLLECTION)
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc');

    if (categoryFilter && categoryFilter !== 'all') {
      query = query.where('category', '==', categoryFilter);
    }

    query = query.limit(limitCount + 1); // Get one extra to check if there are more

    const snapshot = await query.get();
    const resources: Resource[] = [];
    
    snapshot.forEach((doc: any, index: number) => {
      if (index < limitCount) {
        const data = doc.data();
        
        // Filter by search term if provided
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const titleMatch = data.title?.toLowerCase().includes(searchLower);
          const descMatch = data.description?.toLowerCase().includes(searchLower);
          const tagsMatch = data.tags?.some((tag: string) => 
            tag.toLowerCase().includes(searchLower)
          );
          
          if (!titleMatch && !descMatch && !tagsMatch) {
            return; // Skip this document
          }
        }
        
        resources.push({
          id: doc.id,
          ...data
        } as Resource);
      }
    });

    const hasMore = snapshot.size > limitCount;
    return { resources, hasMore };
  } catch (error) {
    console.error('Error fetching published resources (admin):', error);
    throw error;
  }
}

// Create resource (admin only)
export async function createResourceAdmin(resource: Omit<Resource, 'id' | 'createdAt'>): Promise<string> {
  try {
    if (!adminDb) {
      throw new Error('Firebase Admin not initialized');
    }

    const docRef = await adminDb.collection(RESOURCES_COLLECTION).add({
      ...resource,
      createdAt: new Date()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating resource (admin):', error);
    throw error;
  }
}

// Update resource (admin only)
export async function updateResourceAdmin(id: string, updates: Partial<Resource>): Promise<void> {
  try {
    if (!adminDb) {
      throw new Error('Firebase Admin not initialized');
    }

    await adminDb.collection(RESOURCES_COLLECTION).doc(id).update(updates);
  } catch (error) {
    console.error('Error updating resource (admin):', error);
    throw error;
  }
}

// Delete resource (admin only)
export async function deleteResourceAdmin(id: string): Promise<void> {
  try {
    if (!adminDb) {
      throw new Error('Firebase Admin not initialized');
    }

    await adminDb.collection(RESOURCES_COLLECTION).doc(id).delete();
  } catch (error) {
    console.error('Error deleting resource (admin):', error);
    throw error;
  }
}

// Get single resource (admin)
export async function getResourceAdmin(id: string): Promise<Resource | null> {
  try {
    if (!adminDb) {
      throw new Error('Firebase Admin not initialized');
    }

    const doc = await adminDb.collection(RESOURCES_COLLECTION).doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as Resource;
  } catch (error) {
    console.error('Error fetching resource (admin):', error);
    throw error;
  }
}