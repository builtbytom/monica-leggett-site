import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false,
  token: 'skKqet07GvU7mrd4XEjhRuZ0UuUhzeCrHAm0qRtV6doD6rhzJL3Zxs5bx4IeLewQ1yagc1urVDjEIJ7xvBNaJwx8WgSb7YUITZH80w2hpk262HKLFlRIqnQZ4oN5peCSYX7vtJtvpymvIz7f5Mm1oH0QzAeyghcGACOZGlEmZI1aLATA8w5c'
});

async function setupWebhookProper() {
  try {
    console.log('🔗 Setting up webhook via Management API...');
    
    const webhookConfig = {
      name: 'Netlify Deploy Hook',
      url: 'https://api.netlify.com/build_hooks/68c0414920cfb64d3067bb89',
      on: ['mutation'],
      filter: '_type == "homepageSettings"',
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Use Management API endpoint
    const result = await client.request({
      uri: `/projects/li2bkslz/hooks`,
      method: 'POST',
      body: webhookConfig
    });

    console.log('✅ Webhook created successfully!', result);
    
  } catch (error) {
    console.error('❌ Management API failed:', error.message);
    console.log('');
    console.log('💡 ALTERNATIVE APPROACH NEEDED:');
    console.log('   Webhooks need to be set up through Sanity Studio or Dashboard');
    console.log('   Here\'s what we need to do manually:');
    console.log('');
    console.log('   1. Go to: https://www.sanity.io/manage/project/li2bkslz');  
    console.log('   2. Navigate to API → Webhooks');
    console.log('   3. Create new webhook with:');
    console.log('      URL: https://api.netlify.com/build_hooks/68c0414920cfb64d3067bb89');
    console.log('      Trigger: Document changes');
    console.log('      Filter: _type == "homepageSettings"');
    console.log('      HTTP Method: POST');
    console.log('');
    console.log('🚀 Once set up there, Monica\'s edits will trigger automatic deployments!');
  }
}

setupWebhookProper();