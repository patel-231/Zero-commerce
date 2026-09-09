import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './client';
import { Product } from '@/types/product';
import { Category } from '@/types/category';

export const getProducts = async (conditions: QueryConstraint[] = []) => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, ...conditions);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const getFeaturedProducts = async (limitCount = 4) => {
  return getProducts([
    where('featured', '==', true),
    where('isActive', '==', true),
    limit(limitCount)
  ]);
};

export const getProductsByStatus = async (status: string, limitCount = 4) => {
  return getProducts([
    where('status', '==', status),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  ]);
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
};

export const getCategories = async (onlyActive = true) => {
  const categoriesRef = collection(db, 'categories');
  const conditions: QueryConstraint[] = [];
  if (onlyActive) {
    conditions.push(where('isActive', '==', true));
  }
  const q = query(categoriesRef, ...conditions);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
};
