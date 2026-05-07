'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAdminAuth } from '@/lib/auth';
import { saveProfile } from '@/lib/data/profile';
import { saveProject, deleteProject, updateProjectsOrder } from '@/lib/data/projects';
import { saveSkill, deleteSkill, updateSkillsOrder } from '@/lib/data/skills';
import { saveExperience, deleteExperience, updateExperienceOrder } from '@/lib/data/experience';
import { saveEducation, deleteEducation, updateEducationOrder } from '@/lib/data/education';
import { saveCertification, deleteCertification, updateCertificationsOrder } from '@/lib/data/certifications';
import { approveTestimonial, deleteTestimonial, submitTestimonial, updateTestimonialsOrder } from '@/lib/data/testimonials';
import { saveSiteSettings } from '@/lib/data/settings';
import { saveFooterLink, deleteFooterLink, updateFooterLinksOrder } from '@/lib/data/footer';
import { saveAchievement, deleteAchievement, updateAchievementsOrder } from '@/lib/data/achievements';
import { Resend } from 'resend';
import type {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  Certification,
  Achievement,
  Testimonial,
  FooterLink,
} from '@/types';

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const code = formData.get('code') as string;
  if (!code || code !== process.env.ADMIN_ACCESS_CODE) {
    redirect('/admin/login?error=1');
  }
  const cookieStore = await cookies();
  cookieStore.set('admin_token', code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  redirect('/admin');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function saveProfileAction(data: Partial<Profile>) {
  await requireAdminAuth();
  await saveProfile(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function saveProjectAction(data: Partial<Project>) {
  await requireAdminAuth();
  await saveProject(data);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/projects');
  if (data.slug) revalidatePath(`/projects/${data.slug}`);
}

export async function deleteProjectAction(id: string) {
  await requireAdminAuth();
  await deleteProject(id);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/projects');
}

export async function updateProjectsOrderAction(updates: { id: string; order: number }[]) {
  await requireAdminAuth();
  await updateProjectsOrder(updates);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/projects');
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export async function saveSkillAction(data: Partial<Skill>) {
  await requireAdminAuth();
  await saveSkill(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteSkillAction(id: string) {
  await requireAdminAuth();
  await deleteSkill(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateSkillsOrderAction(updates: { id: string; order: number }[]) {
  await requireAdminAuth();
  await updateSkillsOrder(updates);
  revalidatePath('/');
  revalidatePath('/admin');
}

// ─── Experience ──────────────────────────────────────────────────────────────

export async function saveExperienceAction(data: Partial<Experience>) {
  await requireAdminAuth();
  await saveExperience(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteExperienceAction(id: string) {
  await requireAdminAuth();
  await deleteExperience(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateExperienceOrderAction(updates: { id: string; order: number }[]) {
  await requireAdminAuth();
  await updateExperienceOrder(updates);
  revalidatePath('/');
  revalidatePath('/admin');
}

// ─── Education ───────────────────────────────────────────────────────────────

export async function saveEducationAction(data: Partial<Education>) {
  await requireAdminAuth();
  await saveEducation(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteEducationAction(id: string) {
  await requireAdminAuth();
  await deleteEducation(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateEducationOrderAction(updates: { id: string; order: number }[]) {
  await requireAdminAuth();
  await updateEducationOrder(updates);
  revalidatePath('/');
  revalidatePath('/admin');
}

// ─── Certifications ──────────────────────────────────────────────────────────

export async function saveCertificationAction(data: Partial<Certification>) {
  await requireAdminAuth();
  await saveCertification(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteCertificationAction(id: string) {
  await requireAdminAuth();
  await deleteCertification(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateCertificationsOrderAction(updates: { id: string; order: number }[]) {
  await requireAdminAuth();
  await updateCertificationsOrder(updates);
  revalidatePath('/');
  revalidatePath('/admin');
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function approveTestimonialAction(id: string) {
  await requireAdminAuth();
  await approveTestimonial(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteTestimonialAction(id: string) {
  await requireAdminAuth();
  await deleteTestimonial(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateTestimonialsOrderAction(updates: { id: string; order: number }[]) {
  await requireAdminAuth();
  await updateTestimonialsOrder(updates);
  revalidatePath('/');
  revalidatePath('/admin');
}

// Public — no auth required
export async function submitTestimonialAction(
  data: Pick<Testimonial, 'name' | 'role' | 'message' | 'rating'>,
) {
  await submitTestimonial(data);
  revalidatePath('/admin');
}

// ─── Site Settings ───────────────────────────────────────────────────────────

export async function saveSiteSettingsAction(settings: { show_testimonials: boolean }) {
  await requireAdminAuth();
  await saveSiteSettings(settings);
  revalidatePath('/');
  revalidatePath('/admin');
}

// ─── Footer Links ────────────────────────────────────────────────────────────

export async function saveFooterLinkAction(data: Partial<FooterLink>) {
  await requireAdminAuth();
  await saveFooterLink(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteFooterLinkAction(id: string) {
  await requireAdminAuth();
  await deleteFooterLink(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateFooterLinksOrderAction(updates: { id: string; order: number }[]) {
  await requireAdminAuth();
  await updateFooterLinksOrder(updates);
  revalidatePath('/');
  revalidatePath('/admin');
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export async function saveAchievementAction(data: Partial<Achievement>) {
  await requireAdminAuth();
  await saveAchievement(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteAchievementAction(id: string) {
  await requireAdminAuth();
  await deleteAchievement(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateAchievementsOrderAction(updates: { id: string; order: number }[]) {
  await requireAdminAuth();
  await updateAchievementsOrder(updates);
  revalidatePath('/');
  revalidatePath('/admin');
}

// ─── Media Upload ────────────────────────────────────────────────────────────

export async function uploadMediaAction(formData: FormData) {
  await requireAdminAuth();
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { getSupabaseAdmin } = await import('@/lib/supabase/server');
  const adminClient = getSupabaseAdmin();
  
  const { data, error } = await adminClient.storage
    .from('portfolio_media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data: publicUrlData } = adminClient.storage
    .from('portfolio_media')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

// ─── GitHub Import ───────────────────────────────────────────────────────────

export async function fetchGithubRepoAction(url: string) {
  await requireAdminAuth();
  try {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) throw new Error('Invalid GitHub URL');
    const [, owner, repo] = match;
    
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!res.ok) throw new Error('Failed to fetch repo');
    
    const data = await res.json();
    return {
      title: data.name,
      description: data.description || '',
      tags: data.topics || [],
      language: data.language,
      github: url,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// ─── Contact Email ───────────────────────────────────────────────────────────

export async function sendContactEmailAction(data: { name: string; email: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Resend API key is not configured.');
  }

  const resend = new Resend(apiKey);
  
  // Try sending the email. If the user hasn't verified their domain in Resend,
  // they can only send emails to the email address associated with their Resend account
  // from an 'onboarding@resend.dev' address.
  const { error } = await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: 'cek23am024@cekottarakkara.ac.in', // Send to portfolio owner
    subject: `New Contact from ${data.name} via Portfolio`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
  });

  if (error) {
    throw new Error(error.message);
  }
}
