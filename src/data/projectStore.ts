import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';
import type { Project, ContentBlock } from './types';

// ---------------------------------------------------------------------------
// Type mapping: DB uses snake_case, frontend uses camelCase
// ---------------------------------------------------------------------------

interface DbProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  thumbnail: string;
  featured: boolean;
  content_blocks: ContentBlock[];
  created_at: string;
  updated_at: string;
}

function toProject(row: DbProject): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    tags: row.tags,
    thumbnail: row.thumbnail,
    featured: row.featured,
    contentBlocks: row.content_blocks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDbProject(project: Project): DbProject {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    tags: project.tags,
    thumbnail: project.thumbnail,
    featured: project.featured,
    content_blocks: project.contentBlocks,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  };
}

// ---------------------------------------------------------------------------
// CRUD operations via Supabase
// ---------------------------------------------------------------------------

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch projects:', error.message);
    return [];
  }

  return (data as DbProject[]).map(toProject);
}

export async function fetchProjectById(
  id: string
): Promise<Project | undefined> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return toProject(data as DbProject);
}

export async function fetchProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return undefined;
  return toProject(data as DbProject);
}

export async function saveProject(project: Project): Promise<void> {
  const now = new Date().toISOString();
  const isNew = !(await fetchProjectById(project.id));

  const toSave: Project = {
    ...project,
    createdAt: isNew ? now : project.createdAt,
    updatedAt: now,
  };

  const { error } = await supabase
    .from('projects')
    .upsert(toDbProject(toSave));

  if (error) {
    console.error('Failed to save project:', error.message);
    throw new Error(error.message);
  }
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    console.error('Failed to delete project:', error.message);
    throw new Error(error.message);
  }
}

// ---------------------------------------------------------------------------
// Image upload via Supabase Storage
// ---------------------------------------------------------------------------

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const fileName = `${uuidv4()}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from('project-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Failed to upload image:', error.message);
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('project-images').getPublicUrl(filePath);

  return publicUrl;
}

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function createEmptyProject(): Project {
  return {
    id: uuidv4(),
    title: '',
    slug: '',
    description: '',
    tags: [],
    thumbnail: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    contentBlocks: [],
  };
}

export function createContentBlock(type: ContentBlock['type']): ContentBlock {
  const id = uuidv4();
  switch (type) {
    case 'text':
      return { id, type: 'text', body: '' };
    case 'code':
      return { id, type: 'code', code: '', language: 'python', caption: '' };
    case 'image':
      return { id, type: 'image', src: '', alt: '', caption: '' };
    case 'heading':
      return { id, type: 'heading', text: '', level: 2 };
  }
}

export function generateSlug(title: string): string {
  return slugify(title);
}
