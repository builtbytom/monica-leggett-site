import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string().default('Monica Leggett'),
    image: z.string().optional(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    order: z.number(),
    price: z.string().optional(),
    features: z.array(z.string()).optional(),
  }),
});

const eventsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eventDate: z.date(),
    eventTime: z.string(),
    location: z.string(),
    registrationLink: z.string().optional(),
    capacity: z.number().optional(),
    price: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  services: servicesCollection,
  events: eventsCollection,
};