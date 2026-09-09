export interface Admin {
  uid: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  createdAt: string;
}
