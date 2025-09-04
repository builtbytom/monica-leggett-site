import { Handler } from '@netlify/functions';
import { hashPassword, verifyPassword } from '../../src/lib/auth';
import { sharedUsers, sharedSessions } from './shared-memory-store';

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const { currentPassword, newPassword } = JSON.parse(event.body || '{}');
    
    if (!currentPassword || !newPassword) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Current and new passwords required' })
      };
    }

    // Get the authorization token
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const token = authHeader.substring(7);
    const session = sharedSessions.get(token);
    
    if (!session) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid session' })
      };
    }

    // Get the user
    const user = sharedUsers.get(session.userId);
    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

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
    sharedUsers.set(user.id, user);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Password changed successfully'
      })
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