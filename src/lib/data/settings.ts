import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { SiteSettings } from '@/types';

const SETTINGS_ID = 'main';

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', SETTINGS_ID)
    .single();
  if (error || !data) {
    return { id: SETTINGS_ID, show_testimonials: true };
  }
  return data as SiteSettings;
}

export async function saveSiteSettings(settings: Partial<SiteSettings>) {
  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ id: SETTINGS_ID, ...settings }, { onConflict: 'id' });
  if (error) throw error;
}
