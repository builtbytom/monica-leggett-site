// Import node-fetch for Node.js < 18
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  console.log('Test webhook function called');
  
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  try {
    console.log('Testing N8N webhook connectivity...');
    
    // Test data
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Testing webhook connectivity from Netlify function'
    };
    
    // Try to reach the N8N webhook
    const response = await fetch('http://srv820887.hstgr.cloud:5678/webhook/built-by-tom-contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    console.log('Response status:', response.status);
    
    let responseData;
    try {
      responseData = await response.text();
      // Try to parse as JSON if possible
      try {
        responseData = JSON.parse(responseData);
      } catch (e) {
        // Keep as text if not JSON
      }
    } catch (e) {
      responseData = 'Could not read response';
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        webhookUrl: 'http://srv820887.hstgr.cloud:5678/webhook/built-by-tom-contact',
        status: response.status,
        statusText: response.statusText,
        responseData: responseData,
        testData: testData
      }),
    };
  } catch (error) {
    console.error('Error testing webhook:', error);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message,
        errorCode: error.code,
        errorType: error.name,
        webhookUrl: 'http://srv820887.hstgr.cloud:5678/webhook/built-by-tom-contact',
        suggestion: 'Check if N8N is running and the webhook URL is correct'
      }),
    };
  }
};