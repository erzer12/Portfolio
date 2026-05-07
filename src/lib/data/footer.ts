import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { FooterLink } from '@/types';

export async function getFooterLinks(): Promise<FooterLink[]> {
  const { data, error } = await supabase
    .from('footer_links')
    .select('*')
    .order('order', { ascending: true });
  if (error) return [];
  return data as FooterLink[];
}

export async function saveFooterLink(link: Partial<FooterLink>) {
  if (link.id) {
    const { error } = await supabaseAdmin.from('footer_links').update(link).eq('id', link.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from('footer_links').insert(link);
    if (error) throw error;
  }
}

export async function deleteFooterLink(id: string) {
  const { error } = await supabaseAdmin.from('footer_links').delete().eq('id', id);
  if (error) throw error;
}

export async function updateFooterLinksOrder(updates: { id: string; order: number }[]) {
  for (const update of updates) {
    const { error } = await supabaseAdmin
      .from('footer_links')
      .update({ order: update.order })
      .eq('id', update.id);
    if (error) throw error;
  }
}
