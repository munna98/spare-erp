// packages/shared/src/types.ts 

// Your existing types (keeping them as-is)
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  company: {
    id: string;
    name: string;
    tradeLicenseNo: string | null;
    vatRegistrationNo: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string;
    phone: string | null;
    email: string | null;
    website: string | null;
    logo: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  roles: Array<{
    id: string;
    role: {
      id: string;
      name: string;
      description: string | null;
      permissions: Array<{
        id: string;
        permission: {
          id: string;
          name: string;
          resource: string;
          action: string;
        };
      }>;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: RolePermission[];
}

export interface RolePermission {
  id: string;
  permission: Permission;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}

export interface Company {
  id: string;
  name: string;
  tradeLicenseNo: string | null;
  vatRegistrationNo: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo: string | null;
  isActive: boolean;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

// Additional Auth-related types (extending your existing ones)

// Auth Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

// Auth State Management Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// JWT Payload Type
export interface JwtPayload {
  userId: string;
  companyId: string;
  branchId?: string;
  iat?: number;
  exp?: number;
}

// Permission Check Types
export interface PermissionCheck {
  resource: string;
  action: string;
}

// Utility Types
export type UserWithoutPassword = User;
export type UserPermissions = Array<{
  resource: string;
  action: string;
}>;

// Common Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth Error Types
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_DEACTIVATED = 'ACCOUNT_DEACTIVATED',
  COMPANY_DEACTIVATED = 'COMPANY_DEACTIVATED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
}

// Helper type to extract user permissions in a flat format
export type FlatUserPermissions = Array<{
  id: string;
  name: string;
  resource: string;
  action: string;
}>;

// Auth Context Types for React
export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  getUserPermissions: () => FlatUserPermissions;
}