// Import node-fetch for Node.js < 18
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  console.log('Function called with method:', event.httpMethod);
  
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('Parsing body...');
    const body = JSON.parse(event.body || '{}');
    console.log('Received data:', JSON.stringify(body));
    
    console.log('Attempting to forward to N8N...');
    // Forward to n8n webhook
    const response = await fetch('http://srv820887.hstgr.cloud:5678/webhook/built-by-tom-contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('N8N response status:', response.status);
    
    let responseData;
    try {
      responseData = await response.json();
      console.log('N8N response data:', JSON.stringify(responseData));
    } catch (parseError) {
      console.log('Could not parse response as JSON:', parseError.message);
      responseData = { message: 'Response received but not JSON format' };
    }
    
    // If response is not ok, include status in error response
    if (!response.ok) {
      console.error('N8N webhook returned error status:', response.status);
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: 'N8N webhook error',
          status: response.status,
          message: responseData.message || 'Unknown error',
          data: responseData
        }),
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error('Error processing request:', error.message);
    console.error('Full error:', error);
    console.error('Error stack:', error.stack);
    
    // Check if it's a network error
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        statusCode: 503,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Service unavailable',
          message: 'Cannot connect to N8N webhook service',
          details: 'The N8N webhook service may be down or unreachable'
        }),
      };
    }
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to process request',
        message: error.message,
        details: 'Check Netlify function logs for more information'
      }),
    };
  }
};