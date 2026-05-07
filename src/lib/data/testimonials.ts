import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { Testimonial } from '@/types';

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('approved', true)
    .order('order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) return [];
  return data as Testimonial[];
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .order('approved', { ascending: true }) // Show pending first
    .order('order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) return [];
  return data as Testimonial[];
}

export async function submitTestimonial(
  testimonial: Pick<Testimonial, 'name' | 'role' | 'message' | 'rating'>,
) {
  const { error } = await supabase.from('testimonials').insert({
    ...testimonial,
    approved: false,
  });
  if (error) throw error;
}

export async function approveTestimonial(id: string) {
  const { error } = await supabaseAdmin
    .from('testimonials')
    .update({ approved: true })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabaseAdmin.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}

export async function updateTestimonialsOrder(updates: { id: string; order: number }[]) {
  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from('testimonials')
      .update({ order: update.order })
      .eq('id', update.id);
    if (error) throw error;
  }
}
