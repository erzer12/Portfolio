
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export async function sendEmail(formData: z.infer<typeof contactSchema>) {
  const parsedData = contactSchema.safeParse(formData);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.issues.map(issue => issue.message).join(' ');
    return { success: false, message: `Invalid form data: ${errorMessages}` };
  }

  // Save to Firestore
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...parsedData.data,
      timestamp: serverTimestamp(),
    });
    console.log("Document written to Firestore with ID: ", docRef.id);
    return { success: true, message: 'Your message has been saved successfully!' };
  } catch (e) {
    console.error("Error adding document to Firestore: ", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to save message to database. Details: ${errorMessage}` };
  }
}
