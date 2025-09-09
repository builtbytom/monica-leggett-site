import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

// Helper function to fetch all posts (Learning Center articles)
export async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "categories": categories[]->title,
    "author": author->name,
    body
  }`;
  
  return await client.fetch(query);
}

// Helper function to fetch a single post by slug
export async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "categories": categories[]->title,
    "author": author->name,
    body
  }`;
  
  return await client.fetch(query, { slug });
}

// Helper function to fetch categories
export async function getCategories() {
  const query = `*[_type == "category"] {
    _id,
    title,
    description
  }`;
  
  return await client.fetch(query);
}