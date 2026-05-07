import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { Achievement } from '@/types';

export async function getAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('order', { ascending: true });
  if (error) return [];
  return data as Achievement[];
}

export async function saveAchievement(achievement: Partial<Achievement>) {
  if (achievement.id) {
    const { error } = await supabaseAdmin
      .from('achievements')
      .update(achievement)
      .eq('id', achievement.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin
      .from('achievements')
      .insert(achievement);
    if (error) throw error;
  }
}

export async function deleteAchievement(id: string) {
  const { error } = await supabaseAdmin.from('achievements').delete().eq('id', id);
  if (error) throw error;
}

export async function updateAchievementsOrder(updates: { id: string; order: number }[]) {
  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from('achievements')
      .update({ order: update.order })
      .eq('id', update.id);
    if (error) throw error;
  }
}
