import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false,
  token: 'skKqet07GvU7mrd4XEjhRuZ0UuUhzeCrHAm0qRtV6doD6rhzJL3Zxs5bx4IeLewQ1yagc1urVDjEIJ7xvBNaJwx8WgSb7YUITZH80w2hpk262HKLFlRIqnQZ4oN5peCSYX7vtJtvpymvIz7f5Mm1oH0QzAeyghcGACOZGlEmZI1aLATA8w5c'
});

async function createHomepageSettings() {
  const document = {
    _type: 'homepageSettings',
    _id: 'homepage-settings',
    // Hero Section
    heroTitle: 'Doubtful to Decisive:',
    heroSubtitle: 'Eight Steps to Get Unstuck and Take Action',
    heroDescription: 'Transform your life with my bestselling book. Learn the proven framework that\'s helped thousands move from paralysis to purposeful action.',
    heroPrimaryCTA: '📖 Get the Book',
    heroPrimaryLink: '/services/book',
    heroSecondaryCTA: '🎁 Free Action Guide',
    heroSecondaryLink: '/learning-center',
    
    // About Section
    aboutHeading1: 'Meet',
    aboutHeading2: 'Monica Leggett',
    aboutSubtitle: '⭐ Certified Coach, Author, and Speaker',
    aboutBio1: 'I\'m Monica Leggett, a seasoned expert with years of experience dedicated to transforming lives and accelerating goal achievement. With proven methods, endless energy, and infectious enthusiasm, my passion lies in helping individuals navigate both career and personal journeys.',
    aboutBio2: 'My approach isn\'t just about reaching goals; it\'s about the journey, the growth, and the insights you gain along the way. Together, we\'ll unlock your potential and create a life filled with purpose and fulfillment.',
    aboutCTAText: '✨ Learn More About Monica',
    aboutCTALink: '/about',
    
    // Testimonials
    testimonial1Quote: 'Monica\'s coaching transformed my approach to decision-making. I went from constantly second-guessing myself to confidently leading my team.',
    testimonial1Author: 'Sarah M.',
    testimonial1Title: 'Business Owner',
    
    testimonial2Quote: 'The mastermind group changed everything for me. The support and accountability helped me launch my business in just 3 months.',
    testimonial2Author: 'Michael R.',
    testimonial2Title: 'Entrepreneur',
    
    testimonial3Quote: '\'Doubtful to Decisive\' gave me the tools I needed to finally make the career change I\'d been dreaming about for years.',
    testimonial3Author: 'Jennifer K.',
    testimonial3Title: 'Career Changer'
  };

  try {
    const result = await client.createOrReplace(document);
    console.log('✅ Homepage settings created:', result._id);
  } catch (error) {
    console.error('❌ Error creating homepage settings:', error);
  }
}

createHomepageSettings();