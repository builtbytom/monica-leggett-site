const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2].replace('.git', '') };
}

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
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
    const url = `https://api.github.com/repos/${owner}/${repoName}/contents/cms.config.json`;
    
    const requestHeaders = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    // Only add auth if token is available
    if (GITHUB_TOKEN) {
      requestHeaders['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers: requestHeaders });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const config = JSON.parse(content);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(config),
    };
  } catch (error) {
    console.error('Error fetching CMS config:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Failed to fetch CMS config',
        repo,
        hasToken: !!GITHUB_TOKEN
      }),
    };
  }
};