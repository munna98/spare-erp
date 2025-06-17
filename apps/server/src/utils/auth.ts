// server/src/utils/auth.ts

import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { JwtPayload } from '@shared/types';

dotenv.config();

// Ensure JWT_SECRET is properly typed and available
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = 24 * 60 *60; 

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Generate JWT token with proper payload structure
export const generateToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>) => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN
  };
  
  return jwt.sign(payload, JWT_SECRET as string, options);
};

// Verify JWT token and return typed payload
export const verifyToken = (token: string): JwtPayload => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

// Hash password with bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

// Compare password with hash
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Extract user permissions in a flat format for easier checking
export const extractUserPermissions = (user: any) => {
  const permissions: Array<{ resource: string; action: string }> = [];
  
  if (user.roles && Array.isArray(user.roles)) {
    user.roles.forEach((userRole: any) => {
      if (userRole.role && userRole.role.permissions) {
        userRole.role.permissions.forEach((rolePermission: any) => {
          if (rolePermission.permission) {
            permissions.push({
              resource: rolePermission.permission.resource,
              action: rolePermission.permission.action,
            });
          }
        });
      }
    });
  }
  
  return permissions;
};

// Check if user has specific permission
export const hasPermission = (
  user: any,
  resource: string,
  action: string
): boolean => {
  const permissions = extractUserPermissions(user);
  return permissions.some(
    (permission) => 
      permission.resource === resource && permission.action === action
  );
};

// Password validation helper
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'Password must be less than 128 characters' };
  }
  
  return { valid: true };
};