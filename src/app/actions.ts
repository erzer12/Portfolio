
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Resend } from 'resend';

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

  // 1. Save to Firestore
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...parsedData.data,
      timestamp: serverTimestamp(),
    });
    console.log("Document written to Firestore with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document to Firestore: ", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to save message to database. Details: ${errorMessage}` };
  }

  // 2. Send email with Resend
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not found. Skipping email send. Message was saved to Firestore.");
    // We return success because the primary action (saving the message) worked.
    return { success: true, message: 'Your message has been saved successfully!' };
  }
  
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Notifier <noreply@harshilp.codes>', // IMPORTANT: Replace with your verified domain
      to: ['harshilp1234@gmail.com'], // IMPORTANT: Replace with your actual email
      subject: `New Message from ${parsedData.data.name}`,
      html: `
        <p>You received a new message from your portfolio contact form:</p>
        <p><strong>Name:</strong> ${parsedData.data.name}</p>
        <p><strong>Email:</strong> ${parsedData.data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${parsedData.data.message}</p>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }
    
    console.log("Email sent successfully via Resend:", data);
    return { success: true, message: 'Your message has been sent and saved successfully!' };

  } catch (e) {
    console.error("Error sending email with Resend: ", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    // The message was saved to Firestore, but email failed.
    // We can inform the user, but it's not a total failure.
    return { success: false, message: `Message was saved, but failed to send email notification. Details: ${errorMessage}` };
  }
}
