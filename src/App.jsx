import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import AuthScreen from './pages/AuthScreen';
import HomeScreen from './pages/HomeScreen';
import SearchScreen from './pages/SearchScreen';
import PropertyDetailScreen from './pages/PropertyDetailScreen';
import FavoritesScreen from './pages/FavoritesScreen';
import BookingsScreen from './pages/BookingsScreen';
import ProfileScreen from './pages/ProfileScreen';
import NotificationsScreen from './pages/NotificationsScreen';
import SettingsScreen from './pages/SettingsScreen';
import HelpScreen from './pages/HelpScreen';
import TermsScreen from './pages/TermsScreen';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVisits from './pages/admin/AdminVisits';

function AppContent() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="app-wrapper">
        <div className="mobile-container">
          <div className="loading-screen">
            <div className="loading-spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-wrapper">
        <div className="mobile-container">
          <AuthScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <div className="mobile-container">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <HomeScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/property/:id" element={<PropertyDetailScreen />} />
          <Route path="/favorites" element={<FavoritesScreen />} />
          <Route path="/bookings" element={<BookingsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/help" element={<HelpScreen />} />
          <Route path="/terms" element={<TermsScreen />} />

          {/* Admin Routes */}
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />} />
          <Route path="/admin/properties" element={isAdmin ? <AdminProperties /> : <Navigate to="/" replace />} />
          <Route path="/admin/users" element={isAdmin ? <AdminUsers /> : <Navigate to="/" replace />} />
          <Route path="/admin/visits" element={isAdmin ? <AdminVisits /> : <Navigate to="/" replace />} />

          <Route path="*" element={<Navigate to={isAdmin ? '/admin' : '/'} replace />} />
        </Routes>
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
