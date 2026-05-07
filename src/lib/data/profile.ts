import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { Profile } from '@/types';

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from('profile').select('*').eq('id', 'main').single();
  if (error) return null;
  return data as Profile;
}

export async function saveProfile(profile: Partial<Profile>) {
  const { error } = await supabaseAdmin
    .from('profile')
    .upsert({ id: 'main', ...profile }, { onConflict: 'id' });
  if (error) throw error;
}
