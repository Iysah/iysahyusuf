import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Helper function to properly format the private key
function formatPrivateKey(key: string | undefined): string {
  if (!key) {
    throw new Error('FIREBASE_ADMIN_PRIVATE_KEY is not set');
  }
  
  // Check if it's a valid private key format
  if (!key.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Invalid private key format. Please use a proper Firebase service account private key.');
  }
  
  // Handle different possible formats of the private key
  return key
    .replace(/\\n/g, '\n') // Replace literal \n with actual newlines
    .replace(/\\\\/g, '\\') // Replace escaped backslashes
    .trim();
}

// Check if we have valid Firebase Admin credentials
function hasValidCredentials(): boolean {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  
  return !!(
    projectId && 
    clientEmail && 
    privateKey && 
    privateKey.includes('-----BEGIN PRIVATE KEY-----') &&
    clientEmail.includes('@') &&
    clientEmail.includes('.iam.gserviceaccount.com')
  );
}

let app: any = null;
let adminAuth: any = null;
let adminDb: any = null;

// Only initialize Firebase Admin if we have valid credentials
if (hasValidCredentials()) {
  try {
    const firebaseAdminConfig = {
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
      }),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    };

    // Initialize Firebase Admin SDK
    app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
    adminAuth = getAuth(app);
    adminDb = getFirestore(app);
  } catch (error) {
    console.warn('Firebase Admin SDK initialization failed:', error);
  }
} else {
  console.warn('Firebase Admin SDK not initialized: Invalid or missing credentials');
}

export { adminAuth, adminDb };
export default app;