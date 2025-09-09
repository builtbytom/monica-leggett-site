import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false,
  token: 'skKqet07GvU7mrd4XEjhRuZ0UuUhzeCrHAm0qRtV6doD6rhzJL3Zxs5bx4IeLewQ1yagc1urVDjEIJ7xvBNaJwx8WgSb7YUITZH80w2hpk262HKLFlRIqnQZ4oN5peCSYX7vtJtvpymvIz7f5Mm1oH0QzAeyghcGACOZGlEmZI1aLATA8w5c'
});

async function createContactContent() {
  const document = {
    _type: 'contactPageSettings',
    _id: 'contact-page-settings',
    
    // Hero Section
    heroTitle: "Let's Start Your Transformation",
    heroSubtitle: 'Your Journey to Clarity and Confidence Begins Here',
    heroDescription: "Whether you're ready to work together or just exploring your options, I'm here to help. Choose the best way to connect below.",
    
    // Schedule Card
    scheduleTitle: 'Schedule a Free Discovery Call',
    scheduleDescription: '30-minute no-pressure conversation about your goals',
    
    // Contact Info
    contactEmail: 'monica@monicaleggett.com',
    contactPhone: '', // Monica prefers no phone listed
    contactLocation: 'Connecticut, USA',
    
    // Office Hours
    officeHours: 'Monday - Friday: 9:00 AM - 5:00 PM EST\nSaturday: By appointment\nSunday: Closed',
    
    // Social Links
    linkedinUrl: 'https://www.linkedin.com/in/monicaleggett',
    facebookUrl: 'https://www.facebook.com/monicaleggettcoaching',
    instagramUrl: 'https://www.instagram.com/monicaleggett'
  };

  try {
    const result = await client.createOrReplace(document);
    console.log('✅ Contact page content created:', result._id);
  } catch (error) {
    console.error('❌ Error creating contact content:', error);
  }
}

createContactContent();