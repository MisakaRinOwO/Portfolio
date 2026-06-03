import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    role: z.string(),
    stack: z.string(),
    year: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()),
    coverImage: z.string().default('/images/project-placeholder.svg'),
    demoVideo: z.string().optional(),
    screenshots: z.array(z.string()).default([]),
    links: z
      .object({
        demo: z.string().optional(),
        github: z.string().optional(),
        video: z.string().optional(),
      })
      .default({}),
    order: z.number().default(99),
    keyFeatures: z.array(z.string()).optional(),
    focus: z.string().optional(),
    focusCards: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
  }),
});

export const collections = { projects };


