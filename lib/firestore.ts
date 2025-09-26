import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

export interface Resource {
  id?: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category: 'web' | 'app' | 'design' | 'development';
  tags: string[];
  resourceUrl: string;
  createdAt: Timestamp;
  isPublished: boolean;
  featured: boolean;
}

const RESOURCES_COLLECTION = 'resources';

// Get all published resources
export async function getPublishedResources(
  categoryFilter?: string,
  searchTerm?: string,
  limitCount: number = 12,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
) {
  try {
    // Temporary fix: Build query conditionally to avoid composite index requirement
    // TODO: Create composite indexes for isPublished + createdAt and isPublished + category + createdAt
    let q;
    
    if (categoryFilter && categoryFilter !== 'all') {
      // If category filter is applied, we need a different approach
      q = query(
        collection(db, RESOURCES_COLLECTION),
        where('isPublished', '==', true),
        where('category', '==', categoryFilter),
        limit(limitCount * 2) // Get more docs to sort in memory
      );
    } else {
      // For no category filter, we can use orderBy with just isPublished
      q = query(
        collection(db, RESOURCES_COLLECTION),
        where('isPublished', '==', true),
        limit(limitCount * 2) // Get more docs to sort in memory
      );
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const resources: Resource[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Filter by search term if provided
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = data.title.toLowerCase().includes(searchLower);
        const descMatch = data.description.toLowerCase().includes(searchLower);
        const tagMatch = data.tags.some((tag: string) => 
          tag.toLowerCase().includes(searchLower)
        );
        
        if (!titleMatch && !descMatch && !tagMatch) {
          return;
        }
      }
      
      resources.push({
        id: doc.id,
        ...data
      } as Resource);
    });

    // Sort by createdAt in memory as a temporary workaround
    resources.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt.seconds * 1000;
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt.seconds * 1000;
      return bTime - aTime; // Descending order
    });

    // Limit results after sorting
    const limitedResources = resources.slice(0, limitCount);
    const hasMore = resources.length > limitCount;

    return {
      resources: limitedResources,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore
    };
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
}

// Get featured resources
export async function getFeaturedResources() {
  try {
    // Temporary fix: Remove orderBy to avoid composite index requirement
    // TODO: Create composite index for isPublished + featured + createdAt
    const q = query(
      collection(db, RESOURCES_COLLECTION),
      where('isPublished', '==', true),
      where('featured', '==', true),
      limit(6)
    );

    const querySnapshot = await getDocs(q);
    const resources: Resource[] = [];
    
    querySnapshot.forEach((doc) => {
      resources.push({
        id: doc.id,
        ...doc.data()
      } as Resource);
    });

    // Sort by createdAt in memory as a temporary workaround
    resources.sort((a, b) => {
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt.seconds * 1000;
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt.seconds * 1000;
      return bTime - aTime; // Descending order
    });

    return resources;
  } catch (error) {
    console.error('Error fetching featured resources:', error);
    throw error;
  }
}

// Get all resources (for admin)
export async function getAllResources() {
  try {
    const q = query(
      collection(db, RESOURCES_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const resources: Resource[] = [];
    
    querySnapshot.forEach((doc) => {
      resources.push({
        id: doc.id,
        ...doc.data()
      } as Resource);
    });

    return resources;
  } catch (error) {
    console.error('Error fetching all resources:', error);
    throw error;
  }
}

// Get single resource
export async function getResource(id: string) {
  try {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Resource;
    } else {
      throw new Error('Resource not found');
    }
  } catch (error) {
    console.error('Error fetching resource:', error);
    throw error;
  }
}

// Create new resource
export async function createResource(resource: Omit<Resource, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, RESOURCES_COLLECTION), {
      ...resource,
      createdAt: Timestamp.now()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
}

// Update resource
export async function updateResource(id: string, updates: Partial<Resource>) {
  try {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
}

// Delete resource
export async function deleteResource(id: string) {
  try {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
}

// Search resources
export async function searchResources(searchTerm: string, category?: string) {
  try {
    let q = query(
      collection(db, RESOURCES_COLLECTION),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );

    if (category && category !== 'all') {
      q = query(q, where('category', '==', category));
    }

    const querySnapshot = await getDocs(q);
    const resources: Resource[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchLower = searchTerm.toLowerCase();
      
      const titleMatch = data.title.toLowerCase().includes(searchLower);
      const descMatch = data.description.toLowerCase().includes(searchLower);
      const tagMatch = data.tags.some((tag: string) => 
        tag.toLowerCase().includes(searchLower)
      );
      
      if (titleMatch || descMatch || tagMatch) {
        resources.push({
          id: doc.id,
          ...data
        } as Resource);
      }
    });

    return resources;
  } catch (error) {
    console.error('Error searching resources:', error);
    throw error;
  }
}