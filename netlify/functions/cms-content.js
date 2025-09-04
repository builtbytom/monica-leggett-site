function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2].replace('.git', '') };
}

exports.handler = async (event) => {
  // Enable CORS
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

  const repo = event.queryStringParameters?.repo;
  if (!repo) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Repository URL required' }),
    };
  }

  try {
    const { owner, repo: repoName } = parseGitHubUrl(repo);
    const path = 'src/content/site-content.json';
    
    if (event.httpMethod === 'GET') {
      // Fetch content
      const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`;
      
      // For public repos, don't use auth to avoid 401 errors
      const requestHeaders = {
        'Accept': 'application/vnd.github.v3+json',
      };

      const response = await fetch(url, { headers: requestHeaders });

      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = Buffer.from(data.content, 'base64').toString('utf-8');

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          content: JSON.parse(content),
          sha: data.sha,
        }),
      };
    } 
    
    else if (event.httpMethod === 'POST') {
      // For now, just return success for POST requests
      // Writing to GitHub requires authentication, so we'll skip for demo
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Content update would happen here (demo mode)' 
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
        repo
      }),
    };
  }
};