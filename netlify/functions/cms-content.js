exports.handler = async (event) => {
  // Enable CORS for your portal
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // GitHub configuration
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const owner = 'builtbytom';
    const repo = 'monica-leggett-site';
    const filePath = 'content.json';

    if (!GITHUB_TOKEN) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'GitHub token not configured' }),
      };
    }

    if (event.httpMethod === 'GET') {
      // Use GitHub API with fetch instead of Octokit
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Monica-CMS/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = Buffer.from(data.content, 'base64').toString();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          content: JSON.parse(content),
          sha: data.sha, // Need this for updates
        }),
      };
    } 
    
    else if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      
      if (!body.content) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'No content provided' }),
        };
      }

      // Get current file SHA first
      const getCurrentFile = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Monica-CMS/1.0'
        }
      });

      if (!getCurrentFile.ok) {
        throw new Error(`Failed to get current file: ${getCurrentFile.status}`);
      }

      const currentData = await getCurrentFile.json();

      // Update the content.json file
      const updatedContent = JSON.stringify(body.content, null, 2);
      const encodedContent = Buffer.from(updatedContent).toString('base64');

      const updateResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Monica-CMS/1.0'
        },
        body: JSON.stringify({
          message: '🎨 Update content via CMS portal',
          content: encodedContent,
          sha: currentData.sha,
        })
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        throw new Error(`Failed to update file: ${updateResponse.status} ${JSON.stringify(errorData)}`);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Content updated successfully! Site will rebuild in ~2 minutes.' 
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
        error: error.message || 'Failed to process request',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
    };
  }
};