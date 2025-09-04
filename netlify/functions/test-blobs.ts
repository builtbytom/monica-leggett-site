import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    console.log('Environment variables:', {
      NETLIFY_SITE_ID: process.env.NETLIFY_SITE_ID,
      NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN,
      SITE_ID: process.env.SITE_ID,
      DEPLOY_ID: process.env.DEPLOY_ID,
      CONTEXT: process.env.CONTEXT,
      // Check for other possible env var names
      NETLIFY_API_TOKEN: process.env.NETLIFY_API_TOKEN,
      NETLIFY_ACCESS_TOKEN: process.env.NETLIFY_ACCESS_TOKEN,
      // Netlify automatically provides these
      NETLIFY: process.env.NETLIFY,
      BUILD_ID: process.env.BUILD_ID,
    });

    // Try automatic first
    let testStore;
    try {
      testStore = getStore('test');
      console.log('Automatic store creation worked');
    } catch (e) {
      console.log('Automatic failed, trying manual config');
      // Try manual configuration
      const { getStore: getManualStore } = await import('@netlify/blobs');
      testStore = getManualStore({
        name: 'test',
        siteID: process.env.NETLIFY_SITE_ID || process.env.SITE_ID,
        token: process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN,
      });
    }
    await testStore.set('test', 'working');
    const value = await testStore.get('test');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        value,
        env: {
          hasSiteId: !!process.env.NETLIFY_SITE_ID,
          hasToken: !!process.env.NETLIFY_AUTH_TOKEN,
          autoSiteId: process.env.SITE_ID,
          context: process.env.CONTEXT,
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        env: {
          hasSiteId: !!process.env.NETLIFY_SITE_ID,
          hasToken: !!process.env.NETLIFY_AUTH_TOKEN,
          autoSiteId: process.env.SITE_ID,
          context: process.env.CONTEXT,
        }
      })
    };
  }
};