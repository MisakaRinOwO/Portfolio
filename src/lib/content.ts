import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

export async function getProjectEntries(): Promise<ProjectEntry[]> {
  const entries = await getCollection('projects');
  return entries
    .filter((e) => !e.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProject(): Promise<ProjectEntry | undefined> {
  const entries = await getProjectEntries();
  return entries.find((e) => e.data.featured);
}
