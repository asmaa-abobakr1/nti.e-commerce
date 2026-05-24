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
  category: string[] | Category[];
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
