import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { 
  hashPassword, 
  verifyPassword, 
  validatePassword,
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get auth token
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const token = authHeader.substring(7);
    
    let sessions, users;
    try {
      sessions = getStore('sessions');
      users = getStore('users');
    } catch (autoError) {
      // Manual configuration
      const siteId = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
      const authToken = process.env.NETLIFY_AUTH_TOKEN;
      
      if (!siteId) {
        throw new Error('No site ID found in environment');
      }
      
      sessions = getStore({ name: 'sessions', siteID: siteId, token: authToken });
      users = getStore({ name: 'users', siteID: siteId, token: authToken });
    }
    
    // Verify session
    const sessionData = await sessions.get(token);
    if (!sessionData) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid session' })
      };
    }

    const session = JSON.parse(sessionData);
    
    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      await sessions.delete(token);
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Session expired' })
      };
    }

    // Get request data
    const { currentPassword, newPassword } = JSON.parse(event.body || '{}');
    
    if (!currentPassword || !newPassword) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Current and new passwords required' })
      };
    }
    
    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'New password does not meet requirements',
          requirements: passwordValidation.errors
        })
      };
    }

    // Get user data
    const userData = await users.get(session.userId);
    
    if (!userData) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    const user: User = JSON.parse(userData);
    
    // Verify current password
    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Current password is incorrect' })
      };
    }

    // Update password
    user.passwordHash = hashPassword(newPassword);
    await users.set(user.id, JSON.stringify(user));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Change password error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Server error' 
      })
    };
  }
};