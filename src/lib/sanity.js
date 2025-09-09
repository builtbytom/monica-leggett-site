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

// Helper function to fetch homepage content from a special post
export async function getHomepageContent() {
  const query = `*[_type == "post" && slug.current == "homepage-content"][0] {
    _id,
    title,
    body,
    "content": body[0].children[0].text
  }`;
  
  const result = await client.fetch(query);
  
  // If no homepage content exists, return default structure
  if (!result) {
    return {
      heroSlides: [
        {
          title: "Doubtful to Decisive:",
          subtitle: "Eight Steps to Get Unstuck and Take Action",
          description: "Transform your life with my bestselling book. Learn the proven framework that's helped thousands move from paralysis to purposeful action.",
          image: "/images/doubtful-to-decisive-book.png",
          primaryCTA: "📖 Get the Book",
          primaryLink: "/services/book",
          secondaryCTA: "🎁 Free Action Guide", 
          secondaryLink: "/learning-center"
        }
      ],
      aboutSection: {
        heading1: "Meet",
        heading2: "Monica Leggett",
        subtitle: "⭐ Certified Coach, Author, and Speaker",
        bio1: "I'm Monica Leggett, a seasoned expert with years of experience dedicated to transforming lives and accelerating goal achievement. With proven methods, endless energy, and infectious enthusiasm, my passion lies in helping individuals navigate both career and personal journeys.",
        bio2: "My approach isn't just about reaching goals; it's about the journey, the growth, and the insights you gain along the way. Together, we'll unlock your potential and create a life filled with purpose and fulfillment.",
        ctaText: "✨ Learn More About Monica",
        ctaLink: "/about"
      },
      testimonials: [
        {
          quote: "Monica's coaching transformed my approach to decision-making. I went from constantly second-guessing myself to confidently leading my team.",
          author: "Sarah M.",
          title: "Business Owner"
        },
        {
          quote: "The mastermind group changed everything for me. The support and accountability helped me launch my business in just 3 months.",
          author: "Michael R.",
          title: "Entrepreneur"  
        },
        {
          quote: "'Doubtful to Decisive' gave me the tools I needed to finally make the career change I'd been dreaming about for years.",
          author: "Jennifer K.",
          title: "Career Changer"
        }
      ]
    };
  }
  
  // Parse the content if it exists
  try {
    return JSON.parse(result.content);
  } catch (e) {
    // If parsing fails, return the default structure
    return getHomepageContent();
  }
}