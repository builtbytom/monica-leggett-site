import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false,
  token: 'skKqet07GvU7mrd4XEjhRuZ0UuUhzeCrHAm0qRtV6doD6rhzJL3Zxs5bx4IeLewQ1yagc1urVDjEIJ7xvBNaJwx8WgSb7YUITZH80w2hpk262HKLFlRIqnQZ4oN5peCSYX7vtJtvpymvIz7f5Mm1oH0QzAeyghcGACOZGlEmZI1aLATA8w5c'
});

async function createAboutPageContent() {
  const document = {
    _type: 'aboutPageSettings',
    _id: 'about-page-settings',
    
    // Hero Section
    heroTitle: 'Meet Monica Leggett',
    heroSubtitle: 'Professional Certified Coach | Author | Speaker',
    heroMotto: '"Dream It. Plan It. Do It. Live It!"',
    heroStatTitle: '15+ Years',
    heroStatDescription: 'Transforming Lives Through Coaching',
    heroDescription: 'For over 15 years, I\'ve been helping individuals, couples, teams, and small business owners shift from struggling to thriving – one strategic step at a time. As a certified Professional Coach (PCC), mentor coach, and author, I\'m passionate about helping you break free from doubt, overwhelm, and frustration to find clarity, confidence, and joy.\n\nKnown as the "conversation whisperer," I specialize in helping my clients navigate crucial conversations that build or mend relationships. Whether you\'re an emerging leader, a small business owner, or someone seeking personal transformation, I provide the strategic guidance and support you need to achieve your goals.',
    
    // Quick Stats
    stat1Number: '500+',
    stat1Label: 'Clients Transformed',
    stat2Number: '2',
    stat2Label: 'Published Books',
    stat3Number: '15+',
    stat3Label: 'Years Experience',
    stat4Number: '100%',
    stat4Label: 'Client Satisfaction'
  };

  try {
    const result = await client.createOrReplace(document);
    console.log('✅ About page content created:', result._id);
  } catch (error) {
    console.error('❌ Error creating About page content:', error);
  }
}

createAboutPageContent();