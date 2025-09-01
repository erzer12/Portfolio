
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Resend } from 'resend';
import { revalidatePath } from 'next/cache';

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

// --- Admin Panel Actions ---

const skillSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  icon: z.string().min(1, 'Icon is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  github: z.string().url('Must be a valid URL'),
  live: z.string().url('Must be a valid URL'),
  aiHint: z.string().optional(),
  order: z.number().optional(),
});


export async function saveSkill(formData: z.infer<typeof skillSchema>) {
  const parsed = skillSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: 'Invalid skill data.' };
  }
  try {
    const { id, ...skillData } = parsed.data;
    const docRef = id ? doc(db, 'skills', id) : doc(collection(db, 'skills'));
    await setDoc(docRef, skillData, { merge: true });
    revalidatePath('/');
    return { success: true, message: 'Skill saved successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to save skill: ${errorMessage}` };
  }
}

export async function deleteSkill(id: string) {
  try {
    if (!id) throw new Error("Document ID is required for deletion.");
    await deleteDoc(doc(db, 'skills', id));
    revalidatePath('/');
    return { success: true, message: 'Skill deleted successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete skill: ${errorMessage}` };
  }
}

export async function saveProject(formData: z.infer<typeof projectSchema>) {
  const parsed = projectSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: 'Invalid project data.' };
  }
  try {
    const { id, ...projectData } = parsed.data;
    const docRef = id ? doc(db, 'projects', id) : doc(collection(db, 'projects'));
    await setDoc(docRef, projectData, { merge: true });
    revalidatePath('/');
    return { success: true, message: 'Project saved successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to save project: ${errorMessage}` };
  }
}

export async function deleteProject(id: string) {
  try {
    if (!id) throw new Error("Document ID is required for deletion.");
    await deleteDoc(doc(db, 'projects', id));
    revalidatePath('/');
    return { success: true, message: 'Project deleted successfully.' };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete project: ${errorMessage}` };
  }
}
