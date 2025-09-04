import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { 
  hashPassword, 
  validatePassword,
  validateEmail,
  getCorsHeaders,
  type User 
} from '../../src/lib/auth';

export const handler: Handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin;
  const headers = {
    'Content-Type': 'application/json',
    ...getCorsHeaders(origin)
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

    let users;
    try {
      // Try automatic configuration first
      users = getStore('users');
      console.log('User management: Netlify Blobs is working (automatic)');
    } catch (autoError) {
      console.log('User management: Automatic failed, trying manual configuration');
      // Manual configuration using environment variables
      const siteId = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
      const token = process.env.NETLIFY_AUTH_TOKEN;
      
      if (!siteId) {
        throw new Error('No site ID found in environment');
      }
      
      try {
        users = getStore({ name: 'users', siteID: siteId, token });
        console.log('User management: Netlify Blobs is working (manual)');
      } catch (manualError) {
        console.error('User management: Manual configuration also failed:', manualError);
        throw manualError;
      }
    }

    // Ensure admin user exists
    const adminExists = await users.get('admin');
    if (!adminExists) {
      const adminUser = {
        id: 'admin',
        email: 'tom@ibuildcalm.com',
        name: 'Tom Lucia',
        role: 'admin',
        assignedSites: ['all'],
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      await users.set('admin', JSON.stringify(adminUser));
      console.log('Created admin user in user-management');
    }

    switch (event.httpMethod) {
      case 'GET': {
        // Get all users
        const userList: User[] = [];
        const entries = await users.list();
        
        for (const entry of entries.blobs) {
          // Skip the init flag
          if (entry.key === 'init') continue;
          
          const userData = await users.get(entry.key);
          if (userData) {
            try {
              const user = JSON.parse(userData);
              // Validate it's actually a user object
              if (user && typeof user === 'object' && user.email) {
                // Don't send password hashes to frontend
                delete user.passwordHash;
                userList.push(user);
              }
            } catch (e) {
              console.error(`Failed to parse user data for key ${entry.key}:`, e);
            }
          }
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

        // Validate email format
        if (!validateEmail(email)) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid email format' })
          };
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ 
              error: 'Password does not meet requirements',
              requirements: passwordValidation.errors
            })
          };
        }

        // Check if user already exists
        const existingUsers = await users.list();
        for (const entry of existingUsers.blobs) {
          // Skip the init flag
          if (entry.key === 'init') continue;
          
          const userData = await users.get(entry.key);
          if (userData) {
            try {
              const user = JSON.parse(userData);
              // Validate it's actually a user object with an email
              if (user && typeof user === 'object' && user.email && 
                  user.email.toLowerCase() === email.toLowerCase()) {
                return {
                  statusCode: 400,
                  headers,
                  body: JSON.stringify({ error: 'User already exists' })
                };
              }
            } catch (e) {
              console.error(`Failed to parse user data for key ${entry.key}:`, e);
            }
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

        await users.set(newUser.id, JSON.stringify(newUser));

        // Return user without password hash
        delete (newUser as any).passwordHash;
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newUser)
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
        const existingUserData = await users.get(userId);
        
        if (!existingUserData) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'User not found' })
          };
        }

        const existingUser: User = JSON.parse(existingUserData);
        
        // Update fields
        if (updates.name) existingUser.name = updates.name;
        if (updates.assignedSites) existingUser.assignedSites = updates.assignedSites;
        if (updates.password) existingUser.passwordHash = hashPassword(updates.password);
        
        await users.set(userId, JSON.stringify(existingUser));
        
        // Return without password hash
        delete (existingUser as any).passwordHash;
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(existingUser)
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

        await users.delete(userId);
        
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
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    const errorDetails = {
      error: errorMessage,
      // Check if it's a Netlify Blobs configuration error
      isBlobsError: errorMessage.includes('Netlify Blobs') || errorMessage.includes('siteID'),
      env: {
        hasSiteId: !!(process.env.NETLIFY_SITE_ID || process.env.SITE_ID),
        hasToken: !!process.env.NETLIFY_AUTH_TOKEN,
        context: process.env.CONTEXT
      }
    };
    
    console.error('Detailed error:', errorDetails);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorDetails)
    };
  }
};