import { type User } from '../../src/lib/auth';
import { hashPassword } from '../../src/lib/auth';

// Shared in-memory storage for users and sessions
// This is used by both auth-simple and user-management-simple
// Note: This will reset on function cold starts, but both functions will share the same data

// Global singleton pattern to ensure all functions share the same Map
const globalAny = global as any;

if (!globalAny.__sharedUsers) {
  globalAny.__sharedUsers = new Map<string, User>();
  
  // Get admin password from environment or use default
  const adminPassword = process.env.ADMIN_PASSWORD || '#Jaxon14Parker17Allison01Aloy#';
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('WARNING: Using default admin password. Set ADMIN_PASSWORD env var in production!');
  }
  
  // Initialize with admin user
  const ADMIN_USER: User = {
    id: 'admin',
    email: 'tom@ibuildcalm.com',
    name: 'Tom Lucia',
    passwordHash: hashPassword(adminPassword),
    role: 'admin',
    assignedSites: ['all'],
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  globalAny.__sharedUsers.set('admin', ADMIN_USER);
}

if (!globalAny.__sharedSessions) {
  globalAny.__sharedSessions = new Map<string, any>();
}

export const sharedUsers = globalAny.__sharedUsers as Map<string, User>;
export const sharedSessions = globalAny.__sharedSessions as Map<string, any>;