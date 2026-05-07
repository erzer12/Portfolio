import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { Certification } from '@/types';

export async function getCertifications(): Promise<Certification[]> {
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('date', { ascending: false });
  if (error) return [];
  return data as Certification[];
}

export async function saveCertification(cert: Partial<Certification>) {
  if (cert.id) {
    const { error } = await supabaseAdmin.from('certifications').update(cert).eq('id', cert.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from('certifications').insert(cert);
    if (error) throw error;
  }
}

export async function deleteCertification(id: string) {
  const { error } = await supabaseAdmin.from('certifications').delete().eq('id', id);
  if (error) throw error;
}
