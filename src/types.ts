/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductColor {
  name: string;
  value: string; // Tailwind color class or hex code
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  description: string;
  details: string[];
  image: string;
  images: string[];
  colors: ProductColor[];
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviewsCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface User {
  email: string;
  role: 'user' | 'admin';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
}
