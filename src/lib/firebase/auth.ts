import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './client';
import { create } from 'zustand';

interface AuthState {
  user: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: FirebaseUser | null, isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  setUser: (user, isAdmin) => set({ user, isAdmin, loading: false }),
  setLoading: (loading) => set({ loading }),
}));

// Initialize auth listener
export function initAuthListener() {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Check if user is admin
      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        useAuthStore.getState().setUser(user, adminDoc.exists() && adminDoc.data()?.isActive);
      } catch (error) {
        console.error("Error checking admin status:", error);
        useAuthStore.getState().setUser(user, false);
      }
    } else {
      useAuthStore.getState().setUser(null, false);
    }
  });
}
