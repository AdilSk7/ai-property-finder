import { useState, useEffect, useCallback } from 'react';
import { properties as seedProperties } from '../data/properties';

const PROPERTIES_KEY = 'properties';
const DATA_VERSION_KEY = 'properties_data_version';
const CURRENT_DATA_VERSION = '2';  // Bump this when seed data changes

// Seed properties into localStorage if not already there or outdated
function seedIfNeeded() {
  const savedVersion = localStorage.getItem(DATA_VERSION_KEY);
  const existing = localStorage.getItem(PROPERTIES_KEY);

  if (!existing || savedVersion !== CURRENT_DATA_VERSION) {
    // Preserve any admin-added properties (ids > max seed id)
    const maxSeedId = Math.max(...seedProperties.map(p => p.id));
    let adminAdded = [];
    if (existing) {
      try {
        const old = JSON.parse(existing);
        adminAdded = old.filter(p => p.id > maxSeedId);
      } catch (e) { /* ignore parse errors */ }
    }
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify([...seedProperties, ...adminAdded]));
    localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
  }
}

// Get all properties
export function getAllProperties() {
  seedIfNeeded();
  return JSON.parse(localStorage.getItem(PROPERTIES_KEY) || '[]');
}

// Get single property
export function getPropertyById(id) {
  const props = getAllProperties();
  return props.find(p => p.id === parseInt(id) || p.id === id);
}

// Add property
export function addProperty(property) {
  const props = getAllProperties();
  const newId = Math.max(0, ...props.map(p => p.id)) + 1;
  const newProp = { ...property, id: newId };
  props.push(newProp);
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(props));
  return newProp;
}

// Update property
export function updateProperty(id, updates) {
  const props = getAllProperties();
  const idx = props.findIndex(p => p.id === parseInt(id) || p.id === id);
  if (idx === -1) return null;
  props[idx] = { ...props[idx], ...updates };
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(props));
  return props[idx];
}

// Delete property
export function deleteProperty(id) {
  let props = getAllProperties();
  props = props.filter(p => p.id !== parseInt(id) && p.id !== id);
  localStorage.setItem(PROPERTIES_KEY, JSON.stringify(props));
}

// Get all users (for admin)
export function getAllUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]').map(u => {
    const { password, ...safe } = u;
    return safe;
  });
}

// Get all bookings across all users (for admin)
export function getAllBookings() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const allBookings = [];
  users.forEach(u => {
    (u.bookings || []).forEach(b => {
      allBookings.push({
        ...b,
        userId: u.id,
        userName: u.name,
        userEmail: u.email,
        userPhone: u.phone
      });
    });
  });
  return allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Admin update booking status
export function updateBookingStatus(userId, bookingId, newStatus) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIdx = users.findIndex(u => u.id === userId);
  if (userIdx === -1) return;

  const bookingIdx = (users[userIdx].bookings || []).findIndex(b => b.id === bookingId);
  if (bookingIdx === -1) return;

  users[userIdx].bookings[bookingIdx].status = newStatus;
  localStorage.setItem('users', JSON.stringify(users));

  // Update currentUser if it's the same user
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (currentUser && currentUser.id === userId) {
    const { password, ...safe } = users[userIdx];
    localStorage.setItem('currentUser', JSON.stringify(safe));
  }
}

// Custom hook for reactive property list
export function useProperties() {
  const [properties, setProperties] = useState([]);

  const refresh = useCallback(() => {
    setProperties(getAllProperties());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { properties, refresh };
}

// Seed admin account
export function seedAdminAccount() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const adminExists = users.find(u => u.email === 'admin@propertyfinder.com');
  if (!adminExists) {
    users.push({
      id: 'admin-001',
      name: 'Admin',
      email: 'admin@propertyfinder.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin',
      createdAt: new Date().toISOString(),
      favorites: [],
      recentlyViewed: [],
      bookings: []
    });
    localStorage.setItem('users', JSON.stringify(users));
  }
}
