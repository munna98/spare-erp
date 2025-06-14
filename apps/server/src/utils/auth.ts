import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config()

// Ensure JWT_SECRET is properly typed and available
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = 24 * 60 *60; 



if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const generateToken = (payload: {
  userId: string;
  companyId: string;
  branchId?: string;
}) => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN
  };
  
  return jwt.sign(payload, JWT_SECRET as string, options);
};

export const verifyToken = (token: string) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  
  return jwt.verify(token, JWT_SECRET) as {
    userId: string;
    companyId: string;
    branchId?: string;
  };
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};