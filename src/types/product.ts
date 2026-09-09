import { ProductStatus } from './status';

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  status: ProductStatus;
  categoryId: string;
  categoryName?: string;
  images: string[];
  thumbnail?: string;
  stock: number;
  sku: string;
  featured: boolean;
  isActive: boolean;
  tags?: string[];
  specifications?: Record<string, string>;
  features?: string[];
  variants?: any[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  createdAt: string;
  updatedAt: string;
}
