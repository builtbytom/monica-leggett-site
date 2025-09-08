const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  // Enable CORS for your portal
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // In production, set this to your portal URL
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Simple auth check - in production, use proper auth
  const authHeader = event.headers.authorization;
  const expectedToken = process.env.CMS_SECRET || 'monica-site-2025';
  
  if (authHeader !== `Bearer ${expectedToken}`) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    // Path to the content file
    const contentPath = path.join(process.cwd(), 'src/content/site-content.json');
    
    if (event.httpMethod === 'GET') {
      // Read the current content
      const content = await fs.readFile(contentPath, 'utf-8');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          content: JSON.parse(content),
        }),
      };
    } 
    
    else if (event.httpMethod === 'POST') {
      // Parse the incoming content
      const body = JSON.parse(event.body);
      
      if (!body.content) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'No content provided' }),
        };
      }

      // Write the updated content
      await fs.writeFile(
        contentPath, 
        JSON.stringify(body.content, null, 2),
        'utf-8'
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Content updated successfully' 
        }),
      };
    }
    
    else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }
  } catch (error) {
    console.error('CMS content error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Failed to process request'
      }),
    };
  }
};