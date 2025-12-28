/**
 * Firebase Admin SDK for server-side operations
 * This bypasses Firestore security rules and should ONLY be used in Server Actions
 */

import { getApps, cert, initializeApp as initializeAdminApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminDb: FirebaseFirestore.Firestore;

// Initialize Firebase Admin SDK
if (!getApps().length) {
    // For local development and Vercel, use service account key
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : {
            projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

    adminApp = initializeAdminApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

    adminDb = getFirestore(adminApp);
} else {
    adminApp = getApps()[0];
    adminDb = getFirestore(adminApp);
}

export { adminDb };
