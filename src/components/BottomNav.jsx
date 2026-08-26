import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const userNavItems = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/search', icon: '🔍', label: 'Search' },
  { path: '/favorites', icon: '❤️', label: 'Saved' },
  { path: '/bookings', icon: '📅', label: 'My Visits' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

const adminNavItems = [
  { path: '/admin', icon: '📊', label: 'Dashboard' },
  { path: '/admin/properties', icon: '🏘️', label: 'Properties' },
  { path: '/admin/users', icon: '👥', label: 'Users' },
  { path: '/admin/visits', icon: '📅', label: 'Visits' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  // Hide on property detail pages
  if (location.pathname.startsWith('/property/')) return null;

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navItems.map(item => {
        const isActive = item.path === '/' || item.path === '/admin'
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path);
        return (
          <button
            key={item.path}
            id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
