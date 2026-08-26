import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../utils/db';
import PropertyCardV from '../components/PropertyCardV';

export default function FavoritesScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { properties: allProperties, loading } = useProperties();

  const favoriteProperties = useMemo(() => {
    if (!user?.favorites?.length) return [];
    return user.favorites.map(id => allProperties.find(p => p.id === id)).filter(Boolean);
  }, [user, allProperties]);

  return (
    <div className="favorites-screen">
      <h2 className="screen-title">❤️ Saved Properties</h2>
      <p className="screen-subtitle">{favoriteProperties.length} saved properties</p>
      {loading ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading saved properties...
        </div>
      ) : favoriteProperties.length > 0 ? (
        favoriteProperties.map((p, i) => <PropertyCardV key={p.id} property={p} index={i} />)
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💜</div>
          <h3>No saved properties yet</h3>
          <p>Tap the heart icon on any property to save it here.</p>
          <button className="btn-book" style={{ marginTop: '16px', padding: '12px 24px' }}
            onClick={() => navigate('/search')}>Browse Properties</button>
        </div>
      )}
    </div>
  );
}
