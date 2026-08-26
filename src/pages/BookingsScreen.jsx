import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserBookings, cancelBooking } from '../utils/db';

export default function BookingsScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user?.uid) return;
    setLoading(true);
    const data = await getUserBookings(user.uid);
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const getBookingStatus = (booking) => {
    if (booking.status === 'Cancelled') return 'Cancelled';
    const visitDate = new Date(booking.date + 'T' + booking.time);
    if (visitDate < new Date()) return 'Completed';
    return 'Confirmed';
  };

  const filteredBookings = bookings.filter(b => {
    const status = getBookingStatus(b);
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return status === 'Confirmed';
    if (activeTab === 'completed') return status === 'Completed';
    if (activeTab === 'cancelled') return status === 'Cancelled';
    return true;
  });

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this visit?')) {
      await cancelBooking(bookingId);
      // Optimistic update
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
    }
  };

  const statusColors = {
    'Confirmed': { bg: 'rgba(16, 185, 129, 0.15)', color: 'var(--success-light)', icon: '✅' },
    'Completed': { bg: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)', icon: '✓' },
    'Cancelled': { bg: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', icon: '✕' }
  };

  const timeLabels = {
    '09:00': '9:00 AM', '10:00': '10:00 AM', '11:00': '11:00 AM',
    '12:00': '12:00 PM', '14:00': '2:00 PM', '15:00': '3:00 PM',
    '16:00': '4:00 PM', '17:00': '5:00 PM'
  };

  return (
    <div className="bookings-screen">
      <h2 className="screen-title">📅 My Visits</h2>
      <p className="screen-subtitle">{bookings.length} total visits scheduled</p>

      {/* Tabs */}
      <div className="filter-chips" style={{ marginBottom: '20px' }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' }
        ].map(tab => (
          <button
            key={tab.key}
            className={`filter-chip ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading your visits...
        </div>
      ) : filteredBookings.length > 0 ? (
        [...filteredBookings].reverse().map(booking => {
          const status = getBookingStatus(booking);
          const sc = statusColors[status];
          return (
            <div key={booking.id} className="booking-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                  className="booking-status"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  <span>{sc.icon}</span> {status}
                </div>
                {booking.visitId && (
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    fontFamily: 'monospace',
                    background: 'var(--bg-input)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {booking.visitId}
                  </span>
                )}
              </div>

              <h4
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/property/${booking.propertyId}`)}
              >
                {booking.propertyName}
              </h4>
              <div className="booking-location">📍 {booking.propertyLocation}, Bangalore</div>

              <div className="booking-meta">
                <div className="booking-meta-item">
                  <span className="bm-icon">📅</span>
                  {new Date(booking.date).toLocaleDateString('en-IN', {
                    weekday: 'short', day: 'numeric', month: 'short'
                  })}
                </div>
                <div className="booking-meta-item">
                  <span className="bm-icon">⏰</span>
                  {timeLabels[booking.time] || booking.time}
                </div>
                <div className="booking-meta-item">
                  <span className="bm-icon">👤</span>
                  {booking.name}
                </div>
                <div className="booking-meta-item">
                  <span className="bm-icon">👥</span>
                  {booking.visitors || 1} visitor{(booking.visitors || 1) > 1 ? 's' : ''}
                </div>
              </div>

              {status === 'Confirmed' && (
                <button
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#fca5a5',
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'var(--font)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleCancel(booking.id)}
                >
                  ✕ Cancel Visit
                </button>
              )}
            </div>
          );
        })
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{activeTab === 'all' ? 'No visits yet' : `No ${activeTab} visits`}</h3>
          <p>
            {activeTab === 'all'
              ? 'Book a property visit to see your appointments here.'
              : `You don't have any ${activeTab} visits.`}
          </p>
          <button
            className="btn-book"
            style={{ marginTop: '16px', padding: '12px 24px' }}
            onClick={() => navigate('/search')}
          >
            Browse Properties
          </button>
        </div>
      )}
    </div>
  );
}
