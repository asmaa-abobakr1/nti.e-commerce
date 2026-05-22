export * from '../core/models/auth.model';
export * from '../core/models/canDeactivate.model';
export * from '../core/models/cart.model';
export * from '../core/models/order.models';
export * from '../core/models/product.model';
export * from '../core/models/user.model';

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
  isApproved: 1 | 2 | 3; 
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
