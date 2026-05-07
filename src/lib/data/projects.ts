import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';
import type { Project } from '@/types';

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true });
  if (error) return [];
  return data as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('order', { ascending: true })
    .limit(3);
  if (error) return [];
  return data as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data as Project;
}

export async function saveProject(project: Partial<Project>) {
  if (project.id) {
    const { error } = await supabaseAdmin.from('projects').update(project).eq('id', project.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdmin.from('projects').insert(project);
    if (error) throw error;
  }
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const { data, error } = await supabase.from('projects').select('slug');
  if (error) return [];
  return data.map((p: { slug: string }) => p.slug);
}
