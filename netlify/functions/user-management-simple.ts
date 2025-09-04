import { Handler } from '@netlify/functions';
import { hashPassword, type User } from '../../src/lib/auth';
import { sharedUsers as inMemoryUsers } from './shared-memory-store';

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
    // Simple auth check - in production, verify the session token
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    switch (event.httpMethod) {
      case 'GET': {
        // Get all users
        const userList: User[] = [];
        
        for (const [id, user] of inMemoryUsers) {
          // Don't send password hashes to frontend
          const { passwordHash, ...userWithoutPassword } = user;
          userList.push(userWithoutPassword as User);
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(userList)
        };
      }

      case 'POST': {
        // Create new user
        const { email, name, password, assignedSites } = JSON.parse(event.body || '{}');
        
        if (!email || !name || !password) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Email, name, and password required' })
          };
        }

        // Check if user already exists
        for (const [id, user] of inMemoryUsers) {
          if (user && user.email && user.email.toLowerCase() === email.toLowerCase()) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'User already exists' })
            };
          }
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          email: email.toLowerCase(),
          name,
          passwordHash: hashPassword(password),
          role: 'client',
          assignedSites: assignedSites || [],
          createdAt: new Date().toISOString(),
          status: 'active'
        };

        inMemoryUsers.set(newUser.id, newUser);

        // Return user without password hash
        const { passwordHash, ...userWithoutPassword } = newUser;
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(userWithoutPassword)
        };
      }

      case 'PUT': {
        // Update user
        const { userId } = event.queryStringParameters || {};
        if (!userId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'User ID required' })
          };
        }

        const updates = JSON.parse(event.body || '{}');
        const existingUser = inMemoryUsers.get(userId);
        
        if (!existingUser) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'User not found' })
          };
        }
        
        // Update fields
        if (updates.name) existingUser.name = updates.name;
        if (updates.assignedSites) existingUser.assignedSites = updates.assignedSites;
        if (updates.password) existingUser.passwordHash = hashPassword(updates.password);
        
        inMemoryUsers.set(userId, existingUser);
        
        // Return without password hash
        const { passwordHash, ...userWithoutPassword } = existingUser;
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(userWithoutPassword)
        };
      }

      case 'DELETE': {
        // Delete user
        const { userId } = event.queryStringParameters || {};
        if (!userId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'User ID required' })
          };
        }

        // Don't allow deleting admin
        if (userId === 'admin') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Cannot delete admin user' })
          };
        }

        inMemoryUsers.delete(userId);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };
      }

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('User management error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Server error' 
      })
    };
  }
};