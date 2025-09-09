import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false,
  token: 'skKqet07GvU7mrd4XEjhRuZ0UuUhzeCrHAm0qRtV6doD6rhzJL3Zxs5bx4IeLewQ1yagc1urVDjEIJ7xvBNaJwx8WgSb7YUITZH80w2hpk262HKLFlRIqnQZ4oN5peCSYX7vtJtvpymvIz7f5Mm1oH0QzAeyghcGACOZGlEmZI1aLATA8w5c'
});

async function createServiceContent() {
  // Book Page
  const bookDocument = {
    _type: 'servicePageSettings',
    _id: 'service-book',
    serviceType: 'book',
    heroTitle: 'Doubtful to Decisive',
    heroSubtitle: 'Eight Steps to Get Unstuck and Take Action',
    heroDescription: 'Are you tired of feeling stuck, overwhelmed, or paralyzed by doubt? In this transformative guide, I\'ll equip you with the tools and strategies to cultivate an empowered mindset, declare your aspirations, and chart a clear path to achieve them.',
    mainContent: [
      {
        _type: 'block',
        _key: 'block1',
        style: 'h2',
        children: [{_type: 'span', text: 'Transform Your Doubt Into Decisive Action'}]
      },
      {
        _type: 'block',
        _key: 'block2',
        style: 'normal',
        children: [{_type: 'span', text: 'This book is your practical guide to breaking free from analysis paralysis and taking confident steps toward your goals. Through eight proven steps, you\'ll discover how to move from doubt to decision, from fear to fulfillment.'}]
      }
    ],
    ctaText: 'Buy on Amazon - $19.99',
    ctaLink: 'https://www.amazon.com/dp/B0CR5MX15D'
  };

  // Personal Coaching Page  
  const personalCoachingDocument = {
    _type: 'servicePageSettings',
    _id: 'service-personal-coaching',
    serviceType: 'personal-coaching',
    heroTitle: 'Personal Coaching',
    heroSubtitle: 'Transform Your Life, One Step at a Time',
    heroDescription: 'Through personalized one-on-one coaching sessions, I\'ll help you identify obstacles, clarify your goals, and create actionable strategies to achieve lasting transformation.',
    mainContent: [],
    ctaText: 'Schedule Your Discovery Call',
    ctaLink: '/contact'
  };

  // Mentor Coaching Page
  const mentorCoachingDocument = {
    _type: 'servicePageSettings',
    _id: 'service-mentor-coaching',
    serviceType: 'mentor-coaching',
    heroTitle: 'Mentor Coaching',
    heroSubtitle: 'Elevate Your Coaching Practice',
    heroDescription: 'Whether you\'re pursuing ICF certification or seeking to enhance your coaching skills, I provide the guidance and support you need to excel in your coaching journey.',
    mainContent: [],
    ctaText: 'Learn More About Mentor Coaching',
    ctaLink: '/contact'
  };

  // Masterminds Page
  const mastermindsDocument = {
    _type: 'servicePageSettings',
    _id: 'service-masterminds',
    serviceType: 'masterminds',
    heroTitle: 'Masterminds',
    heroSubtitle: 'The Power of Collective Wisdom',
    heroDescription: 'Join a supportive community of like-minded individuals committed to personal and professional growth. Together, we\'ll accelerate your journey to success.',
    mainContent: [],
    ctaText: 'Apply to Join',
    ctaLink: '/contact'
  };

  try {
    const book = await client.createOrReplace(bookDocument);
    console.log('✅ Book page content created:', book._id);
    
    const personal = await client.createOrReplace(personalCoachingDocument);
    console.log('✅ Personal Coaching page content created:', personal._id);
    
    const mentor = await client.createOrReplace(mentorCoachingDocument);
    console.log('✅ Mentor Coaching page content created:', mentor._id);
    
    const masterminds = await client.createOrReplace(mastermindsDocument);
    console.log('✅ Masterminds page content created:', masterminds._id);
  } catch (error) {
    console.error('❌ Error creating service content:', error);
  }
}

createServiceContent();