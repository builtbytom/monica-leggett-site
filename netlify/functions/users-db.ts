import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface UserSiteMapping {
  userId: string;
  email: string;
  name: string;
  assignedSites: string[];
  createdAt: string;
  lastLogin?: string;
}

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Get the store - this is your "database"
    const store = getStore('users');
    
    switch (event.httpMethod) {
      case 'GET': {
        // Get all users or specific user
        const userId = event.queryStringParameters?.userId;
        
        if (userId) {
          const user = await store.get(userId);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(user ? JSON.parse(user) : null),
          };
        }
        
        // Get all users
        const users: UserSiteMapping[] = [];
        const entries = await store.list();
        
        for (const entry of entries.blobs) {
          const userData = await store.get(entry.key);
          if (userData) {
            users.push(JSON.parse(userData));
          }
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(users),
        };
      }
      
      case 'POST': {
        // Create or update user
        if (!event.body) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Body required' }),
          };
        }
        
        const userData: UserSiteMapping = JSON.parse(event.body);
        await store.set(userData.userId, JSON.stringify(userData));
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };
      }
      
      case 'DELETE': {
        const userId = event.queryStringParameters?.userId;
        if (!userId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'userId required' }),
          };
        }
        
        await store.delete(userId);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };
      }
      
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Server error' 
      }),
    };
  }
};