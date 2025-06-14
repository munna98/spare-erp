// packages/shared/src/types.ts 
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