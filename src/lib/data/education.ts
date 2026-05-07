import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { Education } from '@/types';

export async function getEducation(): Promise<Education[]> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('order', { ascending: true });
  if (error) return [];
  return data as Education[];
}

export async function saveEducation(edu: Partial<Education>) {
  if (edu.id) {
    const { error } = await supabaseAdmin.from('education').update(edu).eq('id', edu.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from('education').insert(edu);
    if (error) throw error;
  }
}

export async function deleteEducation(id: string) {
  const { error } = await supabaseAdmin.from('education').delete().eq('id', id);
  if (error) throw error;
}

export async function updateEducationOrder(updates: { id: string; order: number }[]) {
  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from('education')
      .update({ order: update.order })
      .eq('id', update.id);
    if (error) throw error;
  }
}
