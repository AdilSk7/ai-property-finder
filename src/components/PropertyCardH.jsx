import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const propertyEmojis = {
  'Apartment': '🏢',
  'Villa': '🏡',
  'Penthouse': '🏙️'
};

export default function PropertyCardH({ property, gradient, matchScore }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useAuth();
  const liked = isFavorite(property.id);

  return (
    <div
      className="property-card-h"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <div className={`property-card-h-image ${gradient || 'prop-gradient-1'}`}>
        <div className="property-img-placeholder">
          {propertyEmojis[property.propertyType] || '🏢'}
        </div>
        {matchScore && (
          <span className="match-badge">{matchScore}% Match</span>
        )}
        <button
          className={`fav-btn ${liked ? 'liked' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(property.id); }}
        >
          {liked ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="property-card-h-info">
        <h4>{property.name}</h4>
        <div className="location">📍 {property.location}, {property.city}</div>
        <div className="price">{property.priceFormatted}</div>
        <div className="meta">
          <span>🛏 {property.bhk} BHK</span>
          <span>📐 {property.area} sq.ft</span>
          <span>{property.propertyType}</span>
        </div>
      </div>
    </div>
  );
}
