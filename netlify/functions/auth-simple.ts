import { Handler } from '@netlify/functions';
import { 
  hashPassword, 
  verifyPassword, 
  createSession,
  checkLoginRateLimit,
  validateEmail,
  getCorsHeaders,
  type User 
} from '../../src/lib/auth';
import { sharedUsers as users, sharedSessions as sessions } from './shared-memory-store';

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
              retryAfter: 900
            })
          };
        }

        console.log(`Login attempt for: ${email}`);
        
        // Find user by email
        let foundUser: User | null = null;
        for (const [id, user] of users) {
          if (user.email.toLowerCase() === email.toLowerCase()) {
            foundUser = user;
            break;
          }
        }

        if (!foundUser || !verifyPassword(password, foundUser.passwordHash)) {
          console.log('Login failed - user not found or wrong password');
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid credentials' })
          };
        }

        // Check if user is active
        if (foundUser.status === 'inactive') {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Account is inactive' })
          };
        }

        const session = createSession(foundUser);
        sessions.set(session.token, session);

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
        
        if (!token || !sessions.has(token)) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid session' })
          };
        }

        const session = sessions.get(token);
        
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
          sessions.delete(token);
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