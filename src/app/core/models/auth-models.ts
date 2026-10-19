export type UserRole = 'Admin' | 'Manager' | 'Employee';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}
