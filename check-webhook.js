import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false,
  token: 'skKqet07GvU7mrd4XEjhRuZ0UuUhzeCrHAm0qRtV6doD6rhzJL3Zxs5bx4IeLewQ1yagc1urVDjEIJ7xvBNaJwx8WgSb7YUITZH80w2hpk262HKLFlRIqnQZ4oN5peCSYX7vtJtvpymvIz7f5Mm1oH0QzAeyghcGACOZGlEmZI1aLATA8w5c'
});

async function checkWebhook() {
  try {
    console.log('🔍 Checking webhook status...');
    
    // Check if webhook exists
    const webhook = await client.getDocument('netlify-deploy-webhook');
    console.log('📋 Webhook configuration:');
    console.log(JSON.stringify(webhook, null, 2));
    
    // Check webhook logs/status via API
    const webhookStatus = await client.request({
      uri: `/projects/li2bkslz/webhooks`,
      method: 'GET'
    });
    console.log('📊 Project webhooks:', webhookStatus);
    
  } catch (error) {
    console.error('❌ Error checking webhook:', error.message);
    
    // Try alternative approach - check if webhooks are supported
    console.log('🔧 Trying alternative webhook setup...');
    try {
      const webhooks = await client.request({
        uri: '/webhooks',
        method: 'GET'
      });
      console.log('Available webhooks:', webhooks);
    } catch (altError) {
      console.error('Alternative check failed:', altError.message);
      console.log('💡 Webhook may need to be set up through Sanity Studio interface');
    }
  }
}

checkWebhook();