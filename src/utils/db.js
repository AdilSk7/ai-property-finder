import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { properties as seedProperties } from '../data/properties';

// Seed properties into Firestore (Called manually via admin)
export async function seedPropertiesToFirestore() {
  try {
    for (const property of seedProperties) {
      // Use the integer ID as the string document ID for consistency
      const docRef = doc(db, 'properties', property.id.toString());
      await setDoc(docRef, property);
    }
    return { success: true };
  } catch (error) {
    console.error("Error seeding properties:", error);
    return { success: false, error };
  }
}

// Get all properties
export async function getAllProperties() {
  const q = query(collection(db, 'properties'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get single property
export async function getPropertyById(id) {
  const docRef = doc(db, 'properties', id.toString());
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}

// Add property
export async function addProperty(property) {
  const nextId = Date.now().toString(); // Use timestamp as ID
  const newProp = { ...property, id: nextId };
  await setDoc(doc(db, 'properties', nextId), newProp);
  return newProp;
}

// Update property
export async function updateProperty(id, updates) {
  const docRef = doc(db, 'properties', id.toString());
  await updateDoc(docRef, updates);
  return { id, ...updates };
}

// Delete property
export async function deleteProperty(id) {
  const docRef = doc(db, 'properties', id.toString());
  await deleteDoc(docRef);
}

// Get all users (for admin)
export async function getAllUsers() {
  const q = query(collection(db, 'users'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
}

// Book a visit
export async function bookVisit(userId, userName, userEmail, userPhone, property, visitData) {
  const booking = {
    userId,
    userName,
    userEmail,
    userPhone,
    propertyId: property.id,
    propertyName: property.name,
    propertyLocation: `${property.location}, ${property.city}`,
    date: visitData.date,
    time: visitData.time,
    visitors: visitData.visitors,
    visitId: `VISIT-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
    status: 'Confirmed',
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(collection(db, 'bookings'), booking);
  return { id: docRef.id, ...booking };
}

// Get bookings for a user
export async function getUserBookings(userId) {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get all bookings (for admin)
export async function getAllBookings() {
  const q = query(collection(db, 'bookings'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt - a.createdAt);
}

// Update booking status
export async function updateBookingStatus(bookingId, newStatus) {
  const docRef = doc(db, 'bookings', bookingId.toString());
  await updateDoc(docRef, { status: newStatus });
}

// Cancel booking
export async function cancelBooking(bookingId) {
  return updateBookingStatus(bookingId, 'Cancelled');
}

// Custom hook for reactive property list
export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllProperties();
      setProperties(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { properties, loading, refresh };
}
