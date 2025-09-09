import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false,
  token: 'skKqet07GvU7mrd4XEjhRuZ0UuUhzeCrHAm0qRtV6doD6rhzJL3Zxs5bx4IeLewQ1yagc1urVDjEIJ7xvBNaJwx8WgSb7YUITZH80w2hpk262HKLFlRIqnQZ4oN5peCSYX7vtJtvpymvIz7f5Mm1oH0QzAeyghcGACOZGlEmZI1aLATA8w5c'
});

async function setupWebhook() {
  try {
    console.log('🔗 Setting up Netlify webhook in Sanity...');
    
    // Create webhook configuration
    const webhook = {
      _type: 'system.webhook',
      _id: 'netlify-deploy-webhook',
      name: 'Netlify Deploy',
      url: 'https://api.netlify.com/build_hooks/68c0414920cfb64d3067bb89',
      on: ['create', 'update', 'delete'],
      filter: '_type == "homepageSettings"',
      httpMethod: 'POST',
      headers: {},
      secret: '',
      description: 'Triggers Netlify rebuild when Monica edits content'
    };

    const result = await client.createOrReplace(webhook);
    console.log('✅ Webhook created successfully!');
    console.log('   Webhook ID:', result._id);
    console.log('   Will trigger on: create, update, delete');
    console.log('   For document type: homepageSettings');
    console.log('');
    console.log('🎉 Monica can now edit content and the site will rebuild automatically!');
    
  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message);
    if (error.statusCode === 403) {
      console.error('   → Token may not have webhook permissions');
    }
  }
}

setupWebhook();