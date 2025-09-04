import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import bcrypt from 'bcryptjs';

// This function initializes a test user for development/testing
export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Get the users store
    const store = getStore('users');
    
    // Create test user
    const testUser = {
      id: 'test-user-1',
      email: 'test@ibuildcalm.com',
      password: await bcrypt.hash('test123', 10),
      name: 'Test User',
      role: 'editor',
      siteAccess: ['monica-leggett'],
      createdAt: new Date().toISOString()
    };

    // Store the test user
    await store.setJSON('test@ibuildcalm.com', testUser);
    
    // Also initialize Monica's user (for later)
    const monicaUser = {
      id: 'monica-1',
      email: 'monica@monicaleggett.com',
      password: await bcrypt.hash('Monica2025!', 10),
      name: 'Monica Leggett',
      role: 'editor',
      siteAccess: ['monica-leggett'],
      createdAt: new Date().toISOString()
    };
    
    await store.setJSON('monica@monicaleggett.com', monicaUser);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Test users initialized successfully',
        users: [
          { email: 'test@ibuildcalm.com', password: 'test123' },
          { email: 'monica@monicaleggett.com', password: 'Monica2025!' }
        ]
      })
    };
  } catch (error) {
    console.error('Init test user error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to initialize test user' 
      })
    };
  }
};