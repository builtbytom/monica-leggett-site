// Simple auth stub for Monica's site - just returns success for development
exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { action } = event.queryStringParameters || {};

    switch (action) {
      case 'login':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            token: 'dev-token',
            user: {
              id: '1',
              email: 'monica@monicaleggett.com',
              name: 'Monica Leggett',
              role: 'admin',
              assignedSites: ['4']
            }
          })
        };

      case 'verify':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            user: {
              id: '1',
              email: 'monica@monicaleggett.com',
              role: 'admin',
              assignedSites: ['4']
            }
          })
        };

      case 'logout':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Server error' 
      })
    };
  }
};