import { Handler } from '@netlify/functions';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// Simple auth check - in production, use proper JWT verification
function verifyAuth(event: any): { user: any; error?: string } {
  const authHeader = event.headers.authorization;
  
  // For development, skip auth
  // In production, verify the JWT token from Netlify Identity
  return { user: { email: 'demo@example.com', siteAccess: ['1', '2'] } };
}

function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2].replace('.git', '') };
}

export const handler: Handler = async (event) => {
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

  // Skip auth for now during development
  // In production, uncomment this:
  /*
  const { user, error } = verifyAuth(event);
  if (!user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: error || 'Unauthorized' }),
    };
  }
  */

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
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content');
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
      // Update content
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Content required' }),
        };
      }

      const { content, sha, message } = JSON.parse(event.body);
      const url = `https://api.github.com/repos/${owner}/${repoName}/contents/${path}`;
      
      const body = {
        message: message || 'Update content via CMS',
        content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
        sha,
      };
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to update content: ${error.message}`);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true }),
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
        error: error instanceof Error ? error.message : 'Failed to process request' 
      }),
    };
  }
};