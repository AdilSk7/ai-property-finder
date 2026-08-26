import { createContext, useContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch extra user details from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ ...firebaseUser, ...userDoc.data() });
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    if (userDoc.exists()) {
      setUser({ ...auth.currentUser, ...userDoc.data() });
    }
  };

  const signup = async (name, email, password, phone) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await firebaseUpdateProfile(userCredential.user, { displayName: name });
      
      const userData = {
        name,
        email,
        phone,
        role: email.toLowerCase() === 'admin@propertyfinder.com' ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        favorites: [],
        recentlyViewed: []
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      setUser({ ...userCredential.user, ...userData });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, updates);
    setUser(prev => ({ ...prev, ...updates }));
  };

  const toggleFavorite = async (propertyId) => {
    if (!user) return;
    const isFav = user.favorites?.includes(propertyId);
    
    // Optimistic UI update
    const newFavs = isFav ? user.favorites.filter(id => id !== propertyId) : [...(user.favorites || []), propertyId];
    setUser(prev => ({ ...prev, favorites: newFavs }));
    
    // Backend update
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      favorites: isFav ? arrayRemove(propertyId) : arrayUnion(propertyId)
    });
  };

  const addRecentlyViewed = async (propertyId) => {
    if (!user) return;
    let recent = user.recentlyViewed || [];
    recent = [propertyId, ...recent.filter(id => id !== propertyId)].slice(0, 10);
    
    // Optimistic update
    setUser(prev => ({ ...prev, recentlyViewed: recent }));
    
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { recentlyViewed: recent });
  };

  const isFavorite = (propertyId) => {
    return user?.favorites?.includes(propertyId) || false;
  };

  const upcomingVisitsCount = 0; // Bookings are now a separate collection, we'll fetch this in the Profile screen instead of counting globally

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user, loading, isAdmin, signup, login, logout, updateProfile, refreshUser,
      toggleFavorite, isFavorite, addRecentlyViewed, upcomingVisitsCount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
