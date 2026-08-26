import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserBookings } from '../utils/db';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [saved, setSaved] = useState(false);
  const [bookingsCount, setBookingsCount] = useState({ total: 0, upcoming: 0 });

  useEffect(() => {
    async function fetchBookings() {
      if (!user?.uid) return;
      try {
        const data = await getUserBookings(user.uid);
        const upcoming = data.filter(b => {
          if (b.status === 'Cancelled') return false;
          const visitDate = new Date(b.date + 'T' + (b.time || '10:00'));
          return visitDate >= new Date();
        }).length;
        setBookingsCount({ total: data.length, upcoming });
      } catch (e) {
        console.error("Failed to fetch bookings count", e);
      }
    }
    fetchBookings();
  }, [user]);

  const handleSave = () => {
    updateProfile(editForm);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const menuItems = [
    { icon: '❤️', text: 'Saved Properties', count: user?.favorites?.length || 0, action: () => navigate('/favorites') },
    { icon: '📅', text: 'My Visits', count: bookingsCount.total, action: () => navigate('/bookings') },
    { icon: '🔍', text: 'Search Properties', action: () => navigate('/search') },
    { icon: '🏠', text: 'All Properties', action: () => navigate('/search') },
    { icon: '🔔', text: 'Notifications', action: () => navigate('/notifications') },
    { icon: '⚙️', text: 'Settings', action: () => navigate('/settings') },
    { icon: '❓', text: 'Help & Support', action: () => navigate('/help') },
    { icon: '📄', text: 'Terms & Privacy', action: () => navigate('/terms') },
  ];

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="profile-screen">
      {saved && (
        <div className="toast">✅ Profile updated successfully!</div>
      )}

      <div className="profile-header">
        <div className="profile-avatar">
          {firstName.charAt(0).toUpperCase()}
        </div>

        {editing ? (
          <div style={{ width: '100%', marginTop: '12px' }}>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Name</label>
              <input
                className="filter-input"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Email</label>
              <input
                className="filter-input"
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Your email"
                type="email"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>Phone</label>
              <input
                className="filter-input"
                value={editForm.phone}
                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="Your phone number"
                type="tel"
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="modal-cancel"
                style={{ flex: 1 }}
                onClick={() => { setEditing(false); setEditForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }); }}
              >
                Cancel
              </button>
              <button
                className="modal-confirm"
                style={{ flex: 1 }}
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2>{user?.name || 'User'}</h2>
            <p>{user?.email}</p>
            {user?.phone && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>📱 {user.phone}</p>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: user?.role === 'admin' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                color: user?.role === 'admin' ? 'var(--warning)' : 'var(--primary-light)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
              </span>
              <button
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                  fontSize: '11px',
                  color: 'var(--primary-light)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font)'
                }}
                onClick={() => setEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary-light)' }}>
            {user?.favorites?.length || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Saved</div>
        </div>
        <div style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--success-light)' }}>
            {bookingsCount.upcoming}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Upcoming</div>
        </div>
        <div style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-light)' }}>
            {user?.recentlyViewed?.length || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Viewed</div>
        </div>
      </div>

      {/* Menu */}
      <div className="profile-menu">
        {menuItems.map((item, i) => (
          <button key={i} className="profile-menu-item" onClick={item.action}>
            <span className="pm-icon">{item.icon}</span>
            <span className="pm-text">{item.text}</span>
            {item.count !== undefined && (
              <span style={{
                background: 'var(--primary)',
                color: 'white',
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                marginRight: '4px'
              }}>
                {item.count}
              </span>
            )}
            <span className="pm-arrow">›</span>
          </button>
        ))}
      </div>

      <button className="logout-btn" onClick={logout}>
        🚪 Logout
      </button>

      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '11px',
        color: 'var(--text-muted)'
      }}>
        PropertyAI v1.0.0 • Simulated AI Matching
      </div>
    </div>
  );
}
