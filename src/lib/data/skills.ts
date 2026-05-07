import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { Skill } from '@/types';

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('order', { ascending: true });
  if (error) return [];
  return data as Skill[];
}

export async function saveSkill(skill: Partial<Skill>) {
  if (skill.id) {
    const { error } = await supabaseAdmin.from('skills').update(skill).eq('id', skill.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from('skills').insert(skill);
    if (error) throw error;
  }
}

export async function deleteSkill(id: string) {
  const { error } = await supabaseAdmin.from('skills').delete().eq('id', id);
  if (error) throw error;
}

export async function updateSkillsOrder(updates: { id: string; order: number }[]) {
  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from('skills')
      .update({ order: update.order })
      .eq('id', update.id);
    if (error) throw error;
  }
}
