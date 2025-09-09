import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false, // Disable CDN for real-time updates during builds
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

// Helper function to fetch homepage content from proper Sanity fields
export async function getHomepageContent() {
  const query = `*[_type == "homepageSettings" && _id == "homepage-settings"][0] {
    _id,
    heroTitle,
    heroSubtitle, 
    heroDescription,
    heroPrimaryCTA,
    heroPrimaryLink,
    heroSecondaryCTA,
    heroSecondaryLink,
    aboutHeading1,
    aboutHeading2,
    aboutSubtitle,
    aboutBio1,
    aboutBio2,
    aboutCTAText,
    aboutCTALink,
    testimonial1Quote,
    testimonial1Author,
    testimonial1Title,
    testimonial2Quote,
    testimonial2Author,
    testimonial2Title,
    testimonial3Quote,
    testimonial3Author,
    testimonial3Title
  }`;
  
  const result = await client.fetch(query);
  
  // If no homepage content exists, return default structure
  if (!result) {
    return {
      hero: {
        title: "Doubtful to Decisive:",
        subtitle: "Eight Steps to Get Unstuck and Take Action",
        description: "Transform your life with my bestselling book. Learn the proven framework that's helped thousands move from paralysis to purposeful action.",
        primaryCTA: "📖 Get the Book",
        primaryLink: "/services/book",
        secondaryCTA: "🎁 Free Action Guide", 
        secondaryLink: "/learning-center"
      },
      about: {
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
  
  // Convert Sanity fields to structured format
  return {
    hero: {
      title: result.heroTitle || "Doubtful to Decisive:",
      subtitle: result.heroSubtitle || "Eight Steps to Get Unstuck and Take Action", 
      description: result.heroDescription || "Transform your life with my bestselling book...",
      primaryCTA: result.heroPrimaryCTA || "📖 Get the Book",
      primaryLink: result.heroPrimaryLink || "/services/book",
      secondaryCTA: result.heroSecondaryCTA || "🎁 Free Action Guide",
      secondaryLink: result.heroSecondaryLink || "/learning-center"
    },
    about: {
      heading1: result.aboutHeading1 || "Meet",
      heading2: result.aboutHeading2 || "Monica Leggett",
      subtitle: result.aboutSubtitle || "⭐ Certified Coach, Author, and Speaker",
      bio1: result.aboutBio1 || "I'm Monica Leggett...",
      bio2: result.aboutBio2 || "My approach isn't just about reaching goals...",
      ctaText: result.aboutCTAText || "✨ Learn More About Monica",
      ctaLink: result.aboutCTALink || "/about"
    },
    testimonials: [
      {
        quote: result.testimonial1Quote || "Monica's coaching transformed my approach...",
        author: result.testimonial1Author || "Sarah M.",
        title: result.testimonial1Title || "Business Owner"
      },
      {
        quote: result.testimonial2Quote || "The mastermind group changed everything...",
        author: result.testimonial2Author || "Michael R.",
        title: result.testimonial2Title || "Entrepreneur"
      },
      {
        quote: result.testimonial3Quote || "'Doubtful to Decisive' gave me the tools...",
        author: result.testimonial3Author || "Jennifer K.",
        title: result.testimonial3Title || "Career Changer"
      }
    ]
  };
}