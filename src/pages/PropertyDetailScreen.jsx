import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPropertyById } from '../utils/db';
import { calculateMatchScore } from '../utils/smartMatch';
import BookVisitModal from '../components/BookVisitModal';

const gradients = [
  'prop-gradient-1', 'prop-gradient-2', 'prop-gradient-3',
  'prop-gradient-4', 'prop-gradient-5', 'prop-gradient-6'
];

const propertyEmojis = { 'Apartment': '🏢', 'Villa': '🏡', 'Penthouse': '🏙️' };

const amenityIcons = {
  'Swimming Pool': '🏊', 'Gym': '💪', 'Parking': '🅿️', 'Security': '🔒',
  'Club House': '🏛', "Children's Play Area": '🎠', 'Jogging Track': '🏃',
  'Power Backup': '⚡', 'Concierge': '🛎', 'Smart Home': '📱',
  'EV Charging': '🔌', 'Spa': '🧖', 'Tennis Court': '🎾', 'Private Garden': '🌿',
  'Home Theatre': '🎬', 'Rooftop Garden': '🌱', 'Infinity Pool': '♾️',
  'Sky Lounge': '🌃', 'Yoga Deck': '🧘', 'Clubhouse': '🏛', 'Library': '📚',
  'Mini Theatre': '🎭', 'Yoga Room': '🧘', 'Squash Court': '🏸',
  'Multipurpose Hall': '🏟', 'Indoor Games': '🎲', 'Amphitheatre': '🎪',
  'Cycling Track': '🚴', 'Badminton Court': '🏸', 'Rainwater Harvesting': '🌧',
  'Private Pool': '🏊', 'Jacuzzi': '🛁', 'Wine Cellar': '🍷',
  'Helipad Access': '🚁', 'Rooftop Lounge': '🌇', 'Table Tennis': '🏓',
  'Billiards Room': '🎱', 'Party Hall': '🎉', 'Landscaped Gardens': '🌺',
  'Co-working Space': '💼', 'Laundry': '👔', 'Pet Park': '🐕',
  'Organic Farm': '🌾', 'Solar Panels': '☀️', 'Basketball Court': '🏀',
  'Meditation Hall': '🕉', 'Golf Course': '⛳', 'Private Terrace': '🏗'
};

export default function PropertyDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loc = useLocation();
  const { toggleFavorite, isFavorite, addRecentlyViewed } = useAuth();
  const [showBooking, setShowBooking] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      try {
        const data = await getPropertyById(id);
        setProperty(data);
        if (data) addRecentlyViewed(data.id);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
    if (loc.state?.openBooking) setShowBooking(true);
  }, [id]);

  const matchResult = useMemo(() => {
    if (!property) return null;
    return calculateMatchScore(property, { maxBudget: 10000000, bhk: 2, location: 'Whitefield', amenities: ['Parking', 'Gym'] });
  }, [property]);

  if (loading) {
    return (
      <div className="detail-screen" style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="detail-screen" style={{ padding: '16px' }}>
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h3>Property not found</h3>
          <button className="btn-view" style={{ marginTop: '12px' }} onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  const liked = isFavorite(property.id);
  const gradientClass = gradients[property.id % gradients.length];

  const handleShare = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="detail-screen">
      {showToast && <div className="toast">📋 Property link copied to clipboard!</div>}

      {/* Image Gallery */}
      <div className="detail-images">
        <div className={`property-img-placeholder ${gradientClass}`}>
          {propertyEmojis[property.propertyType] || '🏢'}
        </div>
        <button className="detail-back" onClick={() => navigate(-1)}>←</button>
        <button className="detail-share" onClick={handleShare}>📤</button>
        <button className={`detail-fav ${liked ? 'liked' : ''}`} onClick={() => toggleFavorite(property.id)}>
          {liked ? '❤️' : '🤍'}
        </button>
        <div className="image-dots">
          {[0, 1, 2].map(i => (
            <button key={i} className={`dot ${activeImage === i ? 'active' : ''}`} onClick={() => setActiveImage(i)} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        {matchResult && <div className="match-score-large">✨ {matchResult.score}% Match</div>}
        <h1 id="property-name">{property.name}</h1>
        <div className="detail-location">📍 {property.location}, {property.city}</div>

        <div className="detail-price-row">
          <div>
            <div className="price">{property.priceFormatted}</div>
            <span className="price-unit">onwards</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>by</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>{property.developer}</div>
          </div>
        </div>

        {/* Meta Grid */}
        <div className="detail-meta-grid">
          <div className="detail-meta-item"><div className="meta-value">{property.bhk} BHK</div><div className="meta-label">Config</div></div>
          <div className="detail-meta-item"><div className="meta-value">{property.area}</div><div className="meta-label">Sq.Ft</div></div>
          <div className="detail-meta-item"><div className="meta-value">{property.floor || 'N/A'}</div><div className="meta-label">Floor</div></div>
          <div className="detail-meta-item"><div className="meta-value">{property.facing || 'N/A'}</div><div className="meta-label">Facing</div></div>
          <div className="detail-meta-item"><div className="meta-value">{(property.furnishing || '').replace('-', ' ')}</div><div className="meta-label">Furnishing</div></div>
          <div className="detail-meta-item"><div className="meta-value">{property.yearBuilt || 'N/A'}</div><div className="meta-label">Year Built</div></div>
        </div>

        {/* Possession */}
        <div className="detail-section">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
            borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600,
            background: property.possession === 'Ready to Move' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
            color: property.possession === 'Ready to Move' ? 'var(--success-light)' : 'var(--warning)',
            border: `1px solid ${property.possession === 'Ready to Move' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`
          }}>
            {property.possession === 'Ready to Move' ? '✅' : '🔨'} {property.possession}
          </div>
        </div>

        {/* Description */}
        <div className="detail-section"><h3>📝 About Property</h3><p>{property.description}</p></div>

        {/* Why This Matches */}
        {matchResult && matchResult.reasons.length > 0 && (
          <div className="detail-section">
            <div className="match-reasons">
              <h3>🎯 Why this matches you</h3>
              {matchResult.reasons.map((r, i) => (
                <div key={i} className="match-reason-item"><span className="check">✓</span><span>{r}</span></div>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        {property.amenities?.length > 0 && (
          <div className="detail-section">
            <h3>🏋️ Amenities</h3>
            <div className="amenity-tags">
              {property.amenities.map(a => (
                <span key={a} className="amenity-tag">{amenityIcons[a] || '✨'} {a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Landmarks */}
        {property.nearbyLandmarks?.length > 0 && (
          <div className="detail-section">
            <h3>📍 Nearby Landmarks</h3>
            <div className="landmark-list">
              {property.nearbyLandmarks.map((l, i) => (
                <div key={i} className="landmark-item"><span className="landmark-icon">📌</span><span>{l}</span></div>
              ))}
            </div>
          </div>
        )}

        {/* Commute */}
        {property.commuteTime && (
          <div className="detail-section">
            <h3>🚗 Estimated Commute</h3>
            <div className="landmark-list">
              {Object.entries(property.commuteTime).filter(([,t]) => t).map(([key, time]) => {
                const name = key === 'mgRoad' ? 'MG Road' : key === 'electronicCity' ? 'Electronic City' : key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <div key={key} className="landmark-item"><span className="landmark-icon">⏱</span><span>{name}: ~{time} min</span></div>
                );
              })}
            </div>
          </div>
        )}

        {/* Spacer for bottom CTA */}
        <div style={{ height: '20px' }} />
      </div>

      {/* Fixed Bottom CTA */}
      <div className="detail-bottom-cta">
        <button className={`detail-fav-btn ${liked ? 'liked' : ''}`} onClick={() => toggleFavorite(property.id)}
          type="button">
          {liked ? '❤️' : '🤍'}
        </button>
        <button id="book-visit-btn" className="book-visit-btn" type="button"
          onClick={() => setShowBooking(true)}>
          📅 Book a Visit
        </button>
      </div>

      {showBooking && <BookVisitModal property={property} onClose={() => setShowBooking(false)} />}
    </div>
  );
}
