import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProperties, getAllUsers, getAllBookings, seedPropertiesToFirestore } from '../../utils/db';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    totalVisits: 0,
    upcomingVisits: 0,
    availableProperties: 0,
    confirmedVisits: 0,
    cancelledVisits: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [properties, users, bookings] = await Promise.all([
          getAllProperties(),
          getAllUsers(),
          getAllBookings()
        ]);
        
        const now = new Date();
        const upcoming = bookings.filter(b => {
          if (b.status === 'Cancelled') return false;
          const d = new Date(b.date + 'T' + (b.time || '10:00'));
          return d >= now;
        });

        const available = properties.filter(p => p.possession === 'Ready to Move');

        setStats({
          totalProperties: properties.length,
          totalUsers: users.filter(u => u.role !== 'admin').length,
          totalVisits: bookings.length,
          upcomingVisits: upcoming.length,
          availableProperties: available.length,
          confirmedVisits: bookings.filter(b => b.status === 'Confirmed').length,
          cancelledVisits: bookings.filter(b => b.status === 'Cancelled').length,
          recentBookings: bookings.slice(0, 5)
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Properties', value: stats.totalProperties, icon: '🏘️', color: '#6366f1', action: () => navigate('/admin/properties') },
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#06b6d4', action: () => navigate('/admin/users') },
    { label: 'Total Visits', value: stats.totalVisits, icon: '📅', color: '#10b981', action: () => navigate('/admin/visits') },
    { label: 'Upcoming Visits', value: stats.upcomingVisits, icon: '⏳', color: '#f59e0b', action: () => navigate('/admin/visits') },
    { label: 'Available Now', value: stats.availableProperties, icon: '✅', color: '#8b5cf6', action: () => navigate('/admin/properties') },
    { label: 'Cancelled', value: stats.cancelledVisits, icon: '❌', color: '#ef4444', action: () => navigate('/admin/visits') },
  ];

  const handleSeed = async () => {
    if (window.confirm('Seed properties to Firestore? This might overwrite existing data.')) {
      setLoading(true);
      await seedPropertiesToFirestore();
      alert('Properties seeded successfully!');
      window.location.reload();
    }
  };

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Admin Dashboard</h2>
          <p className="admin-subtitle">PropertyAI Management</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={handleSeed} style={{ background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '11px' }}>
            🌱 Seed Data
          </button>
          <div className="home-avatar" style={{ background: 'var(--gradient-warm)' }}>👑</div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="admin-stats-grid">
            {cards.map((card, i) => (
              <div key={i} className="admin-stat-card" onClick={card.action}>
                <div className="admin-stat-icon" style={{ background: card.color + '20', color: card.color }}>
                  {card.icon}
                </div>
                <div className="admin-stat-value">{card.value}</div>
                <div className="admin-stat-label">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div style={{ marginTop: '24px' }}>
            <div className="section-header" style={{ padding: 0, marginBottom: '12px' }}>
              <h3>📋 Recent Bookings</h3>
              <button onClick={() => navigate('/admin/visits')}>View All</button>
            </div>

            {stats.recentBookings.length > 0 ? stats.recentBookings.map(b => (
              <div key={b.id} className="admin-list-item">
                <div style={{ flex: 1 }}>
                  <div className="admin-list-title">{b.propertyName}</div>
                  <div className="admin-list-sub">{b.userName} • {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
                <span className={`admin-badge ${b.status?.toLowerCase()}`}>{b.status}</span>
              </div>
            )) : (
              <div className="admin-list-item" style={{ justifyContent: 'center', color: 'var(--text-muted)' }}>
                No bookings yet
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
