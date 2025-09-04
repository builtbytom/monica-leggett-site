import { defineCollection, z } from 'astro:content';

const learningCenter = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.date(),
    category: z.enum(['8-Step Framework', 'Leadership', 'Business', 'Personal Growth', 'Mindset']),
    step: z.number().optional(), // For 8-step framework articles
    readTime: z.number(), // in minutes
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  'learning-center': learningCenter,
};