const { Octokit } = require('@octokit/rest');

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

  // GitHub configuration
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const owner = 'builtbytom';
  const repo = 'monica-leggett-site';
  const path = 'content.json';

  if (!GITHUB_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'GitHub token not configured' }),
    };
  }

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
  });

  try {
    if (event.httpMethod === 'GET') {
      // Fetch the current content.json from GitHub
      const response = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      const content = Buffer.from(response.data.content, 'base64').toString();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          content: JSON.parse(content),
          sha: response.data.sha, // Need this for updates
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

      // Get current file to get its SHA
      const currentFile = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      // Update the content.json file
      const updatedContent = JSON.stringify(body.content, null, 2);
      const encodedContent = Buffer.from(updatedContent).toString('base64');

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: '🎨 Update content via CMS portal',
        content: encodedContent,
        sha: currentFile.data.sha,
      });

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
        details: error.response?.data || error.stack
      }),
    };
  }
};