import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProperties } from '../utils/db';
import { states, getCitiesForState, getLocationsForCity, propertyTypes, bhkOptions, furnishingOptions, possessionOptions, amenitiesList } from '../data/properties';
import { getPropertyMatchResults, parseNaturalQuery } from '../utils/smartMatch';
import PropertyCardV from '../components/PropertyCardV';

export default function SearchScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = location.state?.preferences || {};
  const fromNLP = location.state?.fromNLP;
  const nlpQuery = location.state?.query || '';

  const [showFilters, setShowFilters] = useState(!fromNLP);
  const [filters, setFilters] = useState({
    state: incoming.state || 'All States',
    city: incoming.city || 'All Cities',
    location: incoming.location || 'All Locations',
    maxBudget: incoming.maxBudget || '',
    bhk: incoming.bhk || 0,
    propertyType: incoming.propertyType || 'All Types',
    furnishing: incoming.furnishing || 'Any',
    possession: incoming.possession || 'Any',
    amenities: incoming.amenities || [],
    maxCommute: incoming.maxCommute || '',
    commuteLocation: incoming.commuteLocation || ''
  });
  const [sortBy, setSortBy] = useState('match');

  // Cascading dropdowns
  const availableCities = useMemo(() => getCitiesForState(filters.state), [filters.state]);
  const availableLocations = useMemo(() => getLocationsForCity(filters.city), [filters.city]);

  // Follow up questions for AI search
  const followUpQuestions = useMemo(() => {
    if (!fromNLP) return [];
    const qs = [];
    if (!incoming.maxBudget) qs.push({ q: "What's your maximum budget?", key: 'maxBudget', options: [5000000, 8000000, 10000000, 15000000] });
    if (!incoming.bhk) qs.push({ q: "How many BHK do you need?", key: 'bhk', options: [1, 2, 3, 4] });
    if (!incoming.city) qs.push({ q: "Which city are you looking in?", key: 'city', options: ['Bangalore', 'Mumbai', 'Hyderabad', 'Chennai', 'Pune', 'Gurgaon'] });
    if (!incoming.furnishing) qs.push({ q: "Do you prefer furnished or unfurnished?", key: 'furnishing', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] });
    return qs.slice(0, 2);
  }, [fromNLP, incoming]);

  const [answeredFollowUps, setAnsweredFollowUps] = useState({});
  const handleFollowUp = (key, value) => {
    setAnsweredFollowUps(prev => ({ ...prev, [key]: true }));
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const { properties: allProperties, loading } = useProperties();

  const updateFilter = (key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      // Cascade resets
      if (key === 'state') { next.city = 'All Cities'; next.location = 'All Locations'; }
      if (key === 'city') { next.location = 'All Locations'; }
      return next;
    });
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
    }));
  };

  const results = useMemo(() => {
    let filtered = [...allProperties];

    // Hard filter by state
    if (filters.state !== 'All States') {
      filtered = filtered.filter(p => p.state === filters.state);
    }
    // Hard filter by city
    if (filters.city !== 'All Cities') {
      filtered = filtered.filter(p => p.city === filters.city);
    }
    // Hard filter by location
    if (filters.location !== 'All Locations') {
      filtered = filtered.filter(p => p.location === filters.location);
    }
    // Hard filter by BHK
    if (filters.bhk && Number(filters.bhk) > 0) {
      filtered = filtered.filter(p => p.bhk === Number(filters.bhk));
    }
    // Hard filter by property type
    if (filters.propertyType !== 'All Types') {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }
    // Hard filter by budget
    if (filters.maxBudget && Number(filters.maxBudget) > 0) {
      filtered = filtered.filter(p => p.price <= Number(filters.maxBudget) * 1.1); // 10% tolerance
    }
    // Hard filter by furnishing
    if (filters.furnishing && filters.furnishing !== 'Any') {
      filtered = filtered.filter(p => p.furnishing === filters.furnishing);
    }
    // Hard filter by possession
    if (filters.possession && filters.possession !== 'Any') {
      filtered = filtered.filter(p => p.possession === filters.possession);
    }
    // Hard filter by amenities
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(p =>
        filters.amenities.every(a =>
          p.amenities?.some(pa => pa.toLowerCase().includes(a.toLowerCase()))
        )
      );
    }

    // Now apply AI scoring for ranking (no further filtering)
    const prefs = {
      location: filters.location !== 'All Locations' ? filters.location : null,
      maxBudget: filters.maxBudget ? Number(filters.maxBudget) : null,
      bhk: filters.bhk ? Number(filters.bhk) : null,
      propertyType: filters.propertyType !== 'All Types' ? filters.propertyType : null,
      furnishing: filters.furnishing !== 'Any' ? filters.furnishing : null,
      possession: filters.possession !== 'Any' ? filters.possession : null,
      amenities: filters.amenities,
      maxCommute: filters.maxCommute ? Number(filters.maxCommute) : null,
      commuteLocation: filters.commuteLocation || null
    };
    let matched = getPropertyMatchResults(filtered, prefs);
    if (sortBy === 'price-low') matched.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') matched.sort((a, b) => b.price - a.price);
    else if (sortBy === 'area') matched.sort((a, b) => b.area - a.area);
    return matched;
  }, [filters, sortBy, allProperties]);

  const hasActiveFilters = filters.state !== 'All States' || filters.city !== 'All Cities' ||
    filters.location !== 'All Locations' || filters.maxBudget ||
    filters.bhk || filters.propertyType !== 'All Types' || filters.furnishing !== 'Any' ||
    filters.possession !== 'Any' || filters.amenities.length > 0;

  return (
    <div className="property-list-screen">
      <div className="search-screen-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h2>Smart Property Match</h2>
      </div>

      {/* NLP Result Banner */}
      {fromNLP && nlpQuery && (
        <div className="nlp-result-banner">
          <span className="ai-icon">🤖</span>
          <div className="nlp-content">
            <p>AI understood: <strong>"{nlpQuery}"</strong></p>
            <div className="nlp-tags">
              {incoming.city && <span className="nlp-tag">🏙️ {incoming.city}</span>}
              {incoming.location && <span className="nlp-tag">📍 {incoming.location}</span>}
              {incoming.bhk && <span className="nlp-tag">🛏 {incoming.bhk} BHK</span>}
              {incoming.maxBudget && <span className="nlp-tag">💰 ₹{incoming.maxBudget >= 10000000 ? (incoming.maxBudget/10000000).toFixed(1) + 'Cr' : (incoming.maxBudget/100000) + 'L'}</span>}
              {incoming.propertyType && <span className="nlp-tag">🏠 {incoming.propertyType}</span>}
              {incoming.furnishing && <span className="nlp-tag">🪑 {incoming.furnishing}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Questions */}
      {followUpQuestions.filter(fq => !answeredFollowUps[fq.key]).map((fq, i) => (
        <div key={i} style={{
          margin: '0 0 12px', padding: '14px', background: 'rgba(245, 158, 11, 0.06)',
          border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-md)'
        }}>
          <p style={{ fontSize: '13px', color: 'var(--warning)', marginBottom: '8px', fontWeight: 500 }}>
            🤖 {fq.q}
          </p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {fq.options.map(opt => (
              <button key={opt} className="filter-chip" style={{ fontSize: '11px', padding: '6px 12px' }}
                onClick={() => handleFollowUp(fq.key, opt)}>
                {fq.key === 'maxBudget' ? `₹${opt >= 10000000 ? (opt / 10000000) + 'Cr' : (opt / 100000) + 'L'}` :
                  fq.key === 'bhk' ? `${opt} BHK` : opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Filter Toggle */}
      <button className="filter-chip" style={{ marginBottom: '16px', width: '100%', textAlign: 'center', padding: '12px' }}
        onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? '▲ Hide Filters' : '▼ Show Filters'} {hasActiveFilters ? '• Active' : ''}
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <div style={{ marginBottom: '20px' }}>
          {/* State → City → Location cascade */}
          <div className="filter-section">
            <label>State</label>
            <select className="filter-select" value={filters.state} onChange={e => updateFilter('state', e.target.value)}>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="filter-section">
            <label>City</label>
            <select className="filter-select" value={filters.city} onChange={e => updateFilter('city', e.target.value)}>
              {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-section">
            <label>Location</label>
            <select className="filter-select" value={filters.location} onChange={e => updateFilter('location', e.target.value)}>
              {availableLocations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="filter-section">
            <label>Maximum Budget (₹)</label>
            <input className="filter-input" type="number" placeholder="e.g., 9000000 for ₹90L"
              value={filters.maxBudget} onChange={e => updateFilter('maxBudget', e.target.value)} />
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              {[5000000, 8000000, 10000000, 15000000, 25000000].map(v => (
                <button key={v} className={`filter-chip ${Number(filters.maxBudget) === v ? 'active' : ''}`}
                  style={{ fontSize: '11px', padding: '6px 10px' }}
                  onClick={() => updateFilter('maxBudget', v)}>
                  ₹{v >= 10000000 ? `${v / 10000000}Cr` : `${v / 100000}L`}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <label>BHK</label>
            <div className="filter-chips">
              {bhkOptions.map(opt => (
                <button key={opt.value} className={`filter-chip ${filters.bhk === opt.value ? 'active' : ''}`}
                  onClick={() => updateFilter('bhk', opt.value)}>{opt.label}</button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <label>Property Type</label>
            <div className="filter-chips">
              {propertyTypes.map(t => (
                <button key={t} className={`filter-chip ${filters.propertyType === t ? 'active' : ''}`}
                  onClick={() => updateFilter('propertyType', t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <label>Furnishing</label>
            <select className="filter-select" value={filters.furnishing} onChange={e => updateFilter('furnishing', e.target.value)}>
              {furnishingOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="filter-section">
            <label>Possession</label>
            <select className="filter-select" value={filters.possession} onChange={e => updateFilter('possession', e.target.value)}>
              {possessionOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="filter-section">
            <label>Preferred Amenities</label>
            <div className="amenity-grid">
              {amenitiesList.slice(0, 8).map(a => (
                <div key={a} className={`amenity-check ${filters.amenities.includes(a) ? 'selected' : ''}`}
                  onClick={() => toggleAmenity(a)}>
                  <span className="check-icon">{filters.amenities.includes(a) ? '✓' : ''}</span>
                  {a}
                </div>
              ))}
            </div>
          </div>
          <button className="search-btn" onClick={() => setShowFilters(false)}>
            🔍 Find Properties ({results.length} matches)
          </button>
        </div>
      )}

      {/* Sort & Results */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div className="results-count"><strong>{results.length}</strong> properties found</div>
        <select className="filter-select" style={{ width: 'auto', padding: '8px 30px 8px 10px', fontSize: '12px' }}
          value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="match">Best Match</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="area">Area: Largest</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Finding properties...
        </div>
      ) : results.length > 0 ? results.map((p, i) => (
        <PropertyCardV key={p.id} property={p} matchScore={p.matchResult?.score} index={i} />
      )) : (
        <div className="empty-state">
          <div className="empty-icon">🏠</div>
          <h3>No properties found</h3>
          <p>Try adjusting your filters to see more results</p>
        </div>
      )}
    </div>
  );
}
