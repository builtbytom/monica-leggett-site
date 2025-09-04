import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Secure password hashing with bcrypt
export function hashPassword(password: string): string {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

export function verifyPassword(password: string, hash: string): boolean {
  // Handle legacy SHA-256 hashes for migration
  if (hash.length === 64 && !hash.startsWith('$')) {
    // This is a legacy SHA-256 hash
    const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
    return legacyHash === hash;
  }
  
  // New bcrypt verification
  return bcrypt.compareSync(password, hash);
}

// Generate a secure token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'admin' | 'client';
  assignedSites: string[];
  createdAt: string;
  lastLogin?: string;
  status?: 'active' | 'inactive';
}

// Session interface
export interface Session {
  token: string;
  userId: string;
  email: string;
  role: 'admin' | 'client';
  assignedSites: string[];
  expiresAt: string;
}

// Create session
export function createSession(user: User): Session {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 day sessions
  
  return {
    token: generateToken(),
    userId: user.id,
    email: user.email,
    role: user.role,
    assignedSites: user.assignedSites,
    expiresAt: expiresAt.toISOString()
  };
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; firstAttempt: Date }>();

export function checkLoginRateLimit(email: string): { allowed: boolean; remainingAttempts?: number } {
  const now = new Date();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;
  
  const key = email.toLowerCase();
  const attempts = loginAttempts.get(key);
  
  if (!attempts) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }
  
  // Reset if outside window
  if (now.getTime() - attempts.firstAttempt.getTime() > windowMs) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }
  
  // Check if exceeded
  if (attempts.count >= maxAttempts) {
    return { allowed: false, remainingAttempts: 0 };
  }
  
  // Increment attempts
  attempts.count++;
  return { allowed: true, remainingAttempts: maxAttempts - attempts.count };
}

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Get secure CORS headers
export function getCorsHeaders(origin?: string): Record<string, string> {
  const allowedOrigins = [
    'https://ibuildcalm.com',
    'https://www.ibuildcalm.com',
    'http://localhost:3000',
    'http://localhost:8888'
  ];
  
  const headers: Record<string, string> = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };
  
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else if (process.env.NODE_ENV === 'development') {
    headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
  } else {
    headers['Access-Control-Allow-Origin'] = 'https://ibuildcalm.com';
  }
  
  // Add security headers
  headers['X-Content-Type-Options'] = 'nosniff';
  headers['X-Frame-Options'] = 'DENY';
  headers['X-XSS-Protection'] = '1; mode=block';
  headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
  
  return headers;
}