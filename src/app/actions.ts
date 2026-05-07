'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAdminAuth } from '@/lib/auth';
import { saveProfile } from '@/lib/data/profile';
import { saveProject, deleteProject } from '@/lib/data/projects';
import { saveSkill, deleteSkill } from '@/lib/data/skills';
import { saveExperience, deleteExperience } from '@/lib/data/experience';
import { saveEducation, deleteEducation } from '@/lib/data/education';
import { saveCertification, deleteCertification } from '@/lib/data/certifications';
import { approveTestimonial, deleteTestimonial, submitTestimonial } from '@/lib/data/testimonials';
import { saveSiteSettings } from '@/lib/data/settings';
import type {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  Certification,
  Testimonial,
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
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function saveProjectAction(data: Partial<Project>) {
  await requireAdminAuth();
  await saveProject(data);
  revalidatePath('/');
  revalidatePath('/projects');
  if (data.slug) revalidatePath(`/projects/${data.slug}`);
}

export async function deleteProjectAction(id: string) {
  await requireAdminAuth();
  await deleteProject(id);
  revalidatePath('/');
  revalidatePath('/projects');
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export async function saveSkillAction(data: Partial<Skill>) {
  await requireAdminAuth();
  await saveSkill(data);
  revalidatePath('/');
}

export async function deleteSkillAction(id: string) {
  await requireAdminAuth();
  await deleteSkill(id);
  revalidatePath('/');
}

// ─── Experience ──────────────────────────────────────────────────────────────

export async function saveExperienceAction(data: Partial<Experience>) {
  await requireAdminAuth();
  await saveExperience(data);
  revalidatePath('/');
}

export async function deleteExperienceAction(id: string) {
  await requireAdminAuth();
  await deleteExperience(id);
  revalidatePath('/');
}

// ─── Education ───────────────────────────────────────────────────────────────

export async function saveEducationAction(data: Partial<Education>) {
  await requireAdminAuth();
  await saveEducation(data);
  revalidatePath('/');
}

export async function deleteEducationAction(id: string) {
  await requireAdminAuth();
  await deleteEducation(id);
  revalidatePath('/');
}

// ─── Certifications ──────────────────────────────────────────────────────────

export async function saveCertificationAction(data: Partial<Certification>) {
  await requireAdminAuth();
  await saveCertification(data);
  revalidatePath('/');
}

export async function deleteCertificationAction(id: string) {
  await requireAdminAuth();
  await deleteCertification(id);
  revalidatePath('/');
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function approveTestimonialAction(id: string) {
  await requireAdminAuth();
  await approveTestimonial(id);
  revalidatePath('/');
}

export async function deleteTestimonialAction(id: string) {
  await requireAdminAuth();
  await deleteTestimonial(id);
  revalidatePath('/');
}

// Public — no auth required
export async function submitTestimonialAction(
  data: Pick<Testimonial, 'name' | 'role' | 'message' | 'rating'>,
) {
  await submitTestimonial(data);
}

// ─── Site Settings ───────────────────────────────────────────────────────────

export async function saveSiteSettingsAction(settings: { show_testimonials: boolean }) {
  await requireAdminAuth();
  await saveSiteSettings(settings);
  revalidatePath('/');
}
