import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const gradients = [
  'prop-gradient-1', 'prop-gradient-2', 'prop-gradient-3',
  'prop-gradient-4', 'prop-gradient-5', 'prop-gradient-6'
];

const propertyEmojis = {
  'Apartment': '🏢',
  'Villa': '🏡',
  'Penthouse': '🏙️'
};

export default function PropertyCardV({ property, matchScore, index = 0 }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useAuth();
  const liked = isFavorite(property.id);

  return (
    <div className="property-card-v">
      <div className={`property-card-v-image ${gradients[index % gradients.length]}`}>
        <div className="property-img-placeholder">
          {propertyEmojis[property.propertyType] || '🏢'}
        </div>
        {matchScore && (
          <span className="match-badge">
            ✨ {matchScore}% Match
          </span>
        )}
        <span className="type-badge">{property.propertyType}</span>
        <button
          className={`fav-btn ${liked ? 'liked' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(property.id); }}
        >
          {liked ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="property-card-v-info">
        <div className="card-top">
          <h4>{property.name}</h4>
          <div className="price">{property.priceFormatted}</div>
        </div>
        <div className="location">📍 {property.location}, {property.city}</div>
        <div className="meta-row">
          <div className="meta-item">
            <span className="meta-icon">🛏</span> {property.bhk} BHK
          </div>
          <div className="meta-item">
            <span className="meta-icon">📐</span> {property.area} sq.ft
          </div>
          <div className="meta-item">
            <span className="meta-icon">🪑</span> {property.furnishing}
          </div>
        </div>
        <div className="meta-row">
          <div className="meta-item">
            <span className="meta-icon">🏗</span> {property.possession}
          </div>
        </div>
        <p className="desc">{property.description}</p>
        <div className="card-actions">
          <button
            className="btn-view"
            onClick={() => navigate(`/property/${property.id}`)}
          >
            View Property
          </button>
          <button
            className="btn-book"
            onClick={() => navigate(`/property/${property.id}`, { state: { openBooking: true } })}
          >
            Book Visit
          </button>
        </div>
      </div>
    </div>
  );
}
