
'use server';

import { z } from 'zod';

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

  // This is a placeholder. In a real application, you would use a service
  // like Resend, SendGrid, or Nodemailer to send an email.
  console.log('Sending email with the following data:');
  console.log({
    name: parsedData.data.name,
    email: parsedData.data.email,
    message: parsedData.data.message,
  });

  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate a possible error
  // if (Math.random() > 0.5) {
  //   return { success: false, message: "Failed to send email. Please try again later." };
  // }

  return { success: true, message: 'Email sent successfully!' };
}
