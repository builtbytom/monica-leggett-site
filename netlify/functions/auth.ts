import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { 
  hashPassword, 
  verifyPassword, 
  createSession, 
  checkLoginRateLimit,
  validateEmail,
  getCorsHeaders,
  type User, 
  type Session 
} from '../../src/lib/auth';

// Get admin password from environment or use default (CHANGE IN PRODUCTION!)
const getAdminPassword = () => {
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword) {
    console.log('Using admin password from environment variable');
    return envPassword;
  }
  console.warn('WARNING: Using default admin password. Set ADMIN_PASSWORD env var in production!');
  return '#Jaxon14Parker17Allison01Aloy#';
};

// Default admin user (created on first run)
const DEFAULT_ADMIN: User = {
  id: 'admin',
  email: 'tom@ibuildcalm.com',
  name: 'Tom Lucia',
  passwordHash: hashPassword(getAdminPassword()),
  role: 'admin',
  assignedSites: ['all'],
  createdAt: new Date().toISOString()
};

export const handler: Handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin;
  const headers = {
    'Content-Type': 'application/json',
    ...getCorsHeaders(origin)
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { action } = event.queryStringParameters || {};
    let users, sessions;
    
    try {
      console.log('Auth: Attempting to get Blob stores...');
      console.log('Auth: Environment check:', {
        hasSiteId: !!process.env.SITE_ID,
        hasNetlifySiteId: !!process.env.NETLIFY_SITE_ID,
        context: process.env.CONTEXT
      });
      
      try {
        // Try automatic configuration first
        users = getStore('users');
        sessions = getStore('sessions');
        console.log('Auth: Successfully got Blob stores (automatic)');
      } catch (autoError) {
        console.log('Auth: Automatic failed, trying manual configuration');
        // Manual configuration using environment variables
        const siteId = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
        const token = process.env.NETLIFY_AUTH_TOKEN;
        
        if (!siteId) {
          throw new Error('No site ID found in environment');
        }
        
        users = getStore({ name: 'users', siteID: siteId, token });
        sessions = getStore({ name: 'sessions', siteID: siteId, token });
        console.log('Auth: Successfully got Blob stores (manual)');
      }
    } catch (blobError) {
      console.error('Auth: Netlify Blobs error:', blobError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'The environment has not been configured to use Netlify Blobs. To use it manually, supply the following properties when creating a store: siteID, token' 
        })
      };
    }

    // Initialize admin user if needed
    const adminExists = await users.get('admin');
    if (!adminExists) {
      await users.set('admin', JSON.stringify(DEFAULT_ADMIN));
      console.log('Created default admin user');
    }

    switch (action) {
      case 'login': {
        const { email, password } = JSON.parse(event.body || '{}');
        
        if (!email || !password) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Email and password required' })
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

        // Check rate limiting
        const rateLimit = checkLoginRateLimit(email);
        if (!rateLimit.allowed) {
          console.warn(`Login rate limit exceeded for ${email}`);
          return {
            statusCode: 429,
            headers,
            body: JSON.stringify({ 
              error: 'Too many login attempts. Please try again in 15 minutes.',
              retryAfter: 900 // 15 minutes in seconds
            })
          };
        }

        // Find user by email
        let foundUser: User | null = null;
        const userList = await users.list();
        
        console.log(`Login attempt for: ${email}`);
        console.log(`Found ${userList.blobs.length} users in store`);
        
        for (const entry of userList.blobs) {
          const userData = await users.get(entry.key);
          if (userData) {
            try {
              const user: User = JSON.parse(userData);
              console.log(`Checking user: ${user.email} (${user.id})`);
              if (user.email && user.email.toLowerCase() === email.toLowerCase()) {
                foundUser = user;
                console.log(`Found matching user: ${user.id}, has passwordHash: ${!!user.passwordHash}`);
                break;
              }
            } catch (parseError) {
              console.error(`Failed to parse user data for key ${entry.key}:`, parseError);
            }
          }
        }

        if (!foundUser) {
          console.log('No user found with that email');
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid credentials' })
          };
        }

        if (!verifyPassword(password, foundUser.passwordHash)) {
          console.log('Password verification failed');
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ 
              error: 'Invalid credentials',
              remainingAttempts: rateLimit.remainingAttempts
            })
          };
        }

        // Check if user is active
        if (foundUser.status === 'inactive') {
          console.log('User is inactive');
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Account is inactive' })
          };
        }

        // Create session
        const session = createSession(foundUser);
        await sessions.set(session.token, JSON.stringify(session));

        // Update last login
        foundUser.lastLogin = new Date().toISOString();
        await users.set(foundUser.id, JSON.stringify(foundUser));

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            token: session.token,
            user: {
              id: foundUser.id,
              email: foundUser.email,
              name: foundUser.name,
              role: foundUser.role,
              assignedSites: foundUser.assignedSites
            }
          })
        };
      }

      case 'verify': {
        const { token } = JSON.parse(event.body || '{}');
        
        if (!token) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'No token provided' })
          };
        }

        const sessionData = await sessions.get(token);
        if (!sessionData) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid session' })
          };
        }

        const session: Session = JSON.parse(sessionData);
        
        // Check if expired
        if (new Date(session.expiresAt) < new Date()) {
          await sessions.delete(token);
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Session expired' })
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            user: {
              id: session.userId,
              email: session.email,
              role: session.role,
              assignedSites: session.assignedSites
            }
          })
        };
      }

      case 'logout': {
        const { token } = JSON.parse(event.body || '{}');
        if (token) {
          await sessions.delete(token);
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };
      }

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Server error' 
      })
    };
  }
};