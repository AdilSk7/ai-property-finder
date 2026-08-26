import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../utils/db';
import { useAuth } from '../../context/AuthContext';

const timeLabels = {
  '09:00': '9:00 AM', '10:00': '10:00 AM', '11:00': '11:00 AM',
  '12:00': '12:00 PM', '14:00': '2:00 PM', '15:00': '3:00 PM',
  '16:00': '4:00 PM', '17:00': '5:00 PM'
};

export default function AdminVisits() {
  const { refreshUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => { refresh(); }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      await refresh();
      await refreshUser();
      showToast(`✅ Status updated to ${newStatus}`);
    } catch (e) {
      showToast(`❌ Error updating status`);
      console.error(e);
    }
  };

  const filtered = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'confirmed') return b.status === 'Confirmed';
    if (filter === 'completed') return b.status === 'Completed';
    if (filter === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  const statusColors = {
    'Confirmed': 'confirmed', 'Completed': 'completed', 'Cancelled': 'cancelled'
  };

  return (
    <div className="admin-screen">
      {toast && <div className="toast">{toast}</div>}
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Visit Bookings</h2>
          <p className="admin-subtitle">{bookings.length} total bookings</p>
        </div>
      </div>

      <div className="filter-chips" style={{ marginBottom: '16px' }}>
        {['all', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading bookings...
        </div>
      ) : filtered.length > 0 ? filtered.map(b => (
        <div key={b.id} className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div className="admin-list-title">{b.propertyName}</div>
              <div className="admin-list-sub">📍 {b.propertyLocation}</div>
            </div>
            <span className={`admin-badge ${statusColors[b.status] || ''}`}>{b.status}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>👤 {b.userName || b.name}</span>
            <span>📱 {b.userPhone || b.phone}</span>
            <span>📅 {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span>⏰ {timeLabels[b.time] || b.time}</span>
            <span>✉️ {b.userEmail || b.email || 'N/A'}</span>
            <span>👥 {b.visitors || 1} visitor(s)</span>
          </div>

          {b.visitId && (
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
              {b.visitId}
            </div>
          )}

          <div style={{ display: 'flex', gap: '6px' }}>
            {b.status !== 'Confirmed' && (
              <button className="btn-view" style={{ flex: 1, fontSize: '11px', padding: '7px', color: 'var(--success-light)', borderColor: 'rgba(16,185,129,0.3)' }}
                onClick={() => handleStatusChange(b.id, 'Confirmed')}>
                ✅ Confirm
              </button>
            )}
            {b.status !== 'Completed' && (
              <button className="btn-view" style={{ flex: 1, fontSize: '11px', padding: '7px', color: 'var(--primary-light)', borderColor: 'rgba(99,102,241,0.3)' }}
                onClick={() => handleStatusChange(b.id, 'Completed')}>
                ✓ Complete
              </button>
            )}
            {b.status !== 'Cancelled' && (
              <button className="btn-view" style={{ flex: 1, fontSize: '11px', padding: '7px', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.3)' }}
                onClick={() => handleStatusChange(b.id, 'Cancelled')}>
                ✕ Cancel
              </button>
            )}
          </div>
        </div>
      )) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No {filter === 'all' ? '' : filter} bookings</h3>
          <p>Bookings will appear here when users schedule visits.</p>
        </div>
      )}
    </div>
  );
}
