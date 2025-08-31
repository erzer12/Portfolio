
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
    return { success: false, message: 'Invalid form data.' };
  }

  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...parsedData.data,
      timestamp: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true, message: 'Your message has been sent successfully!' };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, message: 'Failed to send message. Please try again later.' };
  }
}
