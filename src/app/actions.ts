'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

export async function sendEmail(formData: z.infer<typeof contactSchema>) {
  // This is a placeholder. In a real application, you would use a service
  // like Resend, SendGrid, or Nodemailer to send an email.
  console.log('Sending email with the following data:');
  console.log({
    name: formData.name,
    email: formData.email,
    message: formData.message,
  });

  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate a possible error
  // if (Math.random() > 0.5) {
  //   throw new Error("Failed to send email");
  // }

  return { success: true, message: 'Email sent successfully!' };
}
