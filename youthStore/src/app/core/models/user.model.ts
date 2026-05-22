import { CartItem } from './cart.model';

export interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  gender: 'male' | 'female';
  addresses: Address[];
  cart: CartItem[];
  isActive: boolean;
  isDeleted: boolean;
  password?: string;
  acceptsEmails?: boolean;
}
