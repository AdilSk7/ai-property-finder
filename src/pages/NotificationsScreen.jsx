import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockNotifications = [
  { id: 1, icon: '🏠', title: 'New Property Match', message: 'A new 3BHK in Koramangala matches your saved preferences.', time: '2 hours ago', unread: true },
  { id: 2, icon: '📅', title: 'Visit Reminder', message: 'Your property visit is scheduled for tomorrow at 10:00 AM.', time: '5 hours ago', unread: true },
  { id: 3, icon: '💰', title: 'Price Drop Alert', message: 'A property in your favorites has dropped in price by ₹2L.', time: '1 day ago', unread: false },
  { id: 4, icon: '✅', title: 'Visit Confirmed', message: 'Your visit to Prestige Lakeside Habitat has been confirmed.', time: '2 days ago', unread: false },
  { id: 5, icon: '🔔', title: 'Welcome to PropertyAI', message: 'Start exploring thousands of properties across India with AI-powered matching.', time: '5 days ago', unread: false },
];

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div style={{ paddingBottom: '90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <h2 style={{ flex: 1, fontSize: '18px', fontWeight: 700 }}>🔔 Notifications</h2>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font)' }}>
            Mark all read
          </button>
        )}
      </div>

      {unreadCount > 0 && (
        <div style={{ margin: '12px 20px', padding: '10px 14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--primary-light)' }}>
          You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
        </div>
      )}

      <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => markRead(n.id)}
            style={{
              padding: '14px',
              background: n.unread ? 'rgba(99,102,241,0.06)' : 'var(--bg-input)',
              border: `1px solid ${n.unread ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '24px', flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: n.unread ? 700 : 500, color: 'var(--text-primary)' }}>{n.title}</span>
                {n.unread && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', lineHeight: 1.4 }}>{n.message}</p>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
