
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

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: z.infer<typeof contactSchema>) {
  const parsedData = contactSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'Invalid form data.' };
  }

  // Save to Firestore
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...parsedData.data,
      timestamp: serverTimestamp(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document to Firestore: ", e);
    // We can still try to send the email even if Firestore fails
  }

  // Send email via Resend
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // This must be a verified domain in Resend
      to: 'your-email@example.com', // CHANGE THIS to your personal email
      subject: `New message from ${parsedData.data.name}`,
      html: `<p>You received a new message from your portfolio contact form.</p>
             <p><strong>Name:</strong> ${parsedData.data.name}</p>
             <p><strong>Email:</strong> ${parsedData.data.email}</p>
             <p><strong>Message:</strong> ${parsedData.data.message}</p>`,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send email notification.' };
    }

    console.log("Email sent successfully: ", data);
    return { success: true, message: 'Your message has been sent successfully!' };
  } catch (e) {
    console.error("Error sending email: ", e);
    return { success: false, message: 'Failed to send message. Please try again later.' };
  }
}
