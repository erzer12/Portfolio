import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { Experience } from '@/types';

export async function getExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('order', { ascending: true });
  if (error) return [];
  return data as Experience[];
}

export async function saveExperience(exp: Partial<Experience>) {
  if (exp.id) {
    const { error } = await supabaseAdmin.from('experience').update(exp).eq('id', exp.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from('experience').insert(exp);
    if (error) throw error;
  }
}

export async function deleteExperience(id: string) {
  const { error } = await supabaseAdmin.from('experience').delete().eq('id', id);
  if (error) throw error;
}

export async function updateExperienceOrder(updates: { id: string; order: number }[]) {
  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from('experience')
      .update({ order: update.order })
      .eq('id', update.id);
    if (error) throw error;
  }
}
