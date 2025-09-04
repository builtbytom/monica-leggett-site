// Auth stub that returns error - forces fallback to auth-simple
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

  // Always return 500 to force fallback to auth-simple
  return {
    statusCode: 500,
    headers,
    body: JSON.stringify({ error: 'Netlify Blobs not available - use auth-simple' })
  };
};