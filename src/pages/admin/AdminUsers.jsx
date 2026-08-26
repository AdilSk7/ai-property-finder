import { useState, useEffect } from 'react';
import { getAllUsers } from '../../utils/db';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data.filter(u => u.role !== 'admin'));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Users</h2>
          <p className="admin-subtitle">{users.length} registered users</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading users...
        </div>
      ) : users.length > 0 ? users.map(user => (
        <div key={user.id} className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--gradient-primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700, flexShrink: 0
              }}>
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="admin-list-title">{user.name}</div>
                <div className="admin-list-sub">{user.email}</div>
              </div>
            </div>
            <span className="admin-badge confirmed">{user.role || 'user'}</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginLeft: '46px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>📱 {user.phone || 'N/A'}</span>
            <span>❤️ {user.favorites?.length || 0} saved</span>
            <span>📅 {user.bookings?.length || 0} visits</span>
          </div>
        </div>
      )) : (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No users yet</h3>
          <p>Users will appear here after signing up.</p>
        </div>
      )}
    </div>
  );
}
