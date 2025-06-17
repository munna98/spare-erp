// packages/shared/src/index.ts

// Export all types
export * from './types';

// Re-export commonly used types for convenience
export type {
  User,
  Company,
  Branch,
  Role,
  Permission,
  UserRole,
  RolePermission,
  AuthResponse,
  LoginRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  AuthState,
  AuthContextType,
  UserWithoutPassword,
  JwtPayload,
  PermissionCheck,
  AuthError,
  AuthErrorCode,
  FlatUserPermissions,
  ApiResponse,
} from './types';