import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Debug info',
        method: event.httpMethod,
        hasGitHubToken: !!(process.env.GITHUB_TOKEN),
        tokenLength: process.env.GITHUB_TOKEN?.length || 0,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      }),
    };
  }
};