import { User } from './user.model';

export interface JWTPayload {
  id: string;
  role: 'user' | 'admin';
  iat: number;
  exp: number;
}

export interface ApiResponse<T> {
  status: string;
  results?: number;
  data: T;
}
