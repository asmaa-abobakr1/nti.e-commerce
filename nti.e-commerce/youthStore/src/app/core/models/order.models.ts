import { User, Address } from './user.model';
import { CartItem } from './cart.model';

export interface Order {
  _id: string;
  user?: User;
  cartItems: CartItem[];
  totalPrice: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'refused' | 'cancelbyadmin';
  refundStatus: 'none' | 'requested' | 'approved' | 'rejected';
  shippingAddress: Address;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
}
