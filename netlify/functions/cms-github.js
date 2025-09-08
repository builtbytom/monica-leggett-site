// This endpoint works with GitHub to read/write content
// Requires GITHUB_TOKEN environment variable on Netlify

exports.handler = async (event) => {
  // Enable CORS for your portal
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // In production: 'https://ibuildcalm.com'
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // GitHub repo info (hardcoded for Monica's site)
  const owner = 'builtbytom';
  const repo = 'monica-leggett-site';
  const path = 'src/content/site-content.json';
  const branch = 'main';

  // GitHub token from environment
  const githubToken = process.env.GITHUB_TOKEN;
  
  if (!githubToken) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'GitHub token not configured. Please set GITHUB_TOKEN in Netlify environment variables.' 
      }),
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Fetch content from GitHub
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${githubToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = Buffer.from(data.content, 'base64').toString('utf-8');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          content: JSON.parse(content),
          sha: data.sha, // Need this for updating
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

      // First, get current file to get its SHA (required for updates)
      const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      
      const currentFile = await fetch(getUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${githubToken}`,
        }
      });

      if (!currentFile.ok) {
        throw new Error(`Failed to get current file: ${currentFile.status}`);
      }

      const currentData = await currentFile.json();

      // Update the file via GitHub API
      const updateUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `CMS Update: ${new Date().toISOString()}`,
          content: Buffer.from(JSON.stringify(body.content, null, 2)).toString('base64'),
          sha: currentData.sha,
          branch: branch,
        })
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(`GitHub update failed: ${errorData.message}`);
      }

      // After successful update, trigger a Netlify rebuild
      // This ensures the site reflects the changes
      if (process.env.NETLIFY_BUILD_HOOK) {
        fetch(process.env.NETLIFY_BUILD_HOOK, { method: 'POST' });
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Content updated successfully. Site will rebuild in a few moments.' 
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
    console.error('CMS GitHub error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Failed to process request'
      }),
    };
  }
};