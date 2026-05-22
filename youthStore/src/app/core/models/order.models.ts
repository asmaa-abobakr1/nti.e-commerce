import { User } from './user.model';
import { Product } from './product.model';

export interface OrderProduct {
  product: Product | any;
  price: number;
  count: number;
}

export interface Order {
  _id: string;
  user?: User;
  products: OrderProduct[];
  totalPrice: number;
  address: string;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'refused' | 'cancelbyuser' | 'cancelbyadmin' | 'canceledbyadmin';
  refundStatus: 'none' | 'requested' | 'approved' | 'rejected';
  paymentMethod?: string;
  orderAt?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}
