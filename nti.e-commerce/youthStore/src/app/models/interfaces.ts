export interface Category {
  _id: string;
  title: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  title: string;
  category: string | Category;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  title: string;
  desc: string;
  price: number;
  img: string;
  stock: number;
  category?: Category;
  subCategory?: SubCategory;
  gender: 'girls' | 'boys' | 'unisex';
  season?: string;
  isActive: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface Address {
  _id: string;
  alias: string;
  details: string;
  phone: string;
  isDefault: boolean;
}

export interface CartItem {
  product: Product;
  count: number;
  price: number;
  isPriceChanged: boolean;
}

export interface Settings {
  siteName: string;
  heroBadge: string;
  heroTitle: string;
  heroTitlePart2: string;
  heroSubtitle: string;
  heroImage: string;
  shopBtnText: string;
  lookbookBtnText: string;
  qualityCardText: string;
  newArrivalsTitle: string;
  newArrivalsSubTitle: string;
  bestSellersTitle: string;
  bestSellersSubTitle: string;
  testimonialsTitle: string;
  testimonialsSubTitle: string;
  contactTitle: string;
  contactSubTitle: string;
  contactEmail: string;
  phone: string;
  address: string;
  googleMapUrl: string;
  footerAboutText: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  marketingImages: string[];
}

export interface Testimonial {
  _id: string;
  name: string;
  content: string;
  stars: number;
  isApproved: 1 | 2 | 3; // 1: Approved, 2: Pending, 3: Refused
  isDeleted: boolean;
  createdAt: string;
  date?: string;
  user?: { _id: string; name: string; email?: string };
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

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

export interface ApiResponse<T> {
  status: string;
  results?: number;
  data: T;
}
