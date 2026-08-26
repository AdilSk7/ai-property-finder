import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../utils/db';
import { states } from '../data/properties';
import { parseNaturalQuery, getPropertyMatchResults } from '../utils/smartMatch';
import PropertyCardH from '../components/PropertyCardH';

const gradients = [
  'prop-gradient-1', 'prop-gradient-2', 'prop-gradient-3',
  'prop-gradient-4', 'prop-gradient-5', 'prop-gradient-6'
];

const popularCities = [
  { name: 'Bangalore', emoji: '🏙️', state: 'Karnataka' },
  { name: 'Mumbai', emoji: '🌊', state: 'Maharashtra' },
  { name: 'Hyderabad', emoji: '🕌', state: 'Telangana' },
  { name: 'Chennai', emoji: '🛕', state: 'Tamil Nadu' },
  { name: 'Pune', emoji: '🌿', state: 'Maharashtra' },
  { name: 'Gurgaon', emoji: '🏗️', state: 'Delhi NCR' },
  { name: 'Noida', emoji: '🏢', state: 'Delhi NCR' },
  { name: 'Kolkata', emoji: '🌉', state: 'West Bengal' },
  { name: 'Ahmedabad', emoji: '🏛️', state: 'Gujarat' },
  { name: 'Jaipur', emoji: '🏰', state: 'Rajasthan' },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const { properties: allProperties, loading } = useProperties();

  const quickFilters = ['All', '2 BHK', '3 BHK', 'Under ₹1Cr', 'Ready to Move', 'Villa'];

  const handleAISearch = () => {
    if (!searchQuery.trim()) return;
    const preferences = parseNaturalQuery(searchQuery);
    navigate('/search', { state: { preferences, fromNLP: true, query: searchQuery } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAISearch();
  };

  const featuredProperties = useMemo(() => {
    let filtered = [...allProperties];
    if (activeFilter === '2 BHK') filtered = filtered.filter(p => p.bhk === 2);
    else if (activeFilter === '3 BHK') filtered = filtered.filter(p => p.bhk === 3);
    else if (activeFilter === 'Under ₹1Cr') filtered = filtered.filter(p => p.price < 10000000);
    else if (activeFilter === 'Ready to Move') filtered = filtered.filter(p => p.possession === 'Ready to Move');
    else if (activeFilter === 'Villa') filtered = filtered.filter(p => p.propertyType === 'Villa');
    return filtered.slice(0, 8);
  }, [activeFilter, allProperties]);

  const recentlyViewed = useMemo(() => {
    if (!user?.recentlyViewed?.length) return [];
    return user.recentlyViewed
      .map(id => allProperties.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, 6);
  }, [user, allProperties]);

  const topPicks = useMemo(() => {
    const defaultPrefs = { maxBudget: 10000000, bhk: 2 };
    return getPropertyMatchResults(allProperties, defaultPrefs).slice(0, 6);
  }, [allProperties]);

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="home-screen">
      {/* Header */}
      <div className="home-header">
        <div className="home-greeting">
          <span>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋</span>
          <h2>{firstName}</h2>
        </div>
        <div className="home-avatar" onClick={() => navigate('/profile')}>
          {firstName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Hero */}
      <div className="home-hero">
        <h2>Find a home that<br />fits your life</h2>
        <p>AI-powered property matching across India</p>
      </div>

      {loading ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading properties...
        </div>
      ) : (
        <>
          {/* AI Search */}
      <div className="search-container">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="home-search"
            type="text"
            placeholder='Try: "3BHK in Mumbai under 2Cr"'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="ai-badge" onClick={handleAISearch}>AI Search</button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="quick-filters">
        <h3>Quick Filters</h3>
        <div className="filter-chips">
          {quickFilters.map(f => (
            <button key={f} className={`filter-chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="section-header">
        <h3>✨ Featured Properties</h3>
        <button onClick={() => navigate('/search')}>See All</button>
      </div>
      <div className="property-scroll">
        {featuredProperties.map((p, i) => (
          <PropertyCardH key={p.id} property={p} gradient={gradients[i % gradients.length]} />
        ))}
      </div>

      {/* Top AI Picks */}
      <div style={{ marginTop: '8px' }}>
        <div className="section-header">
          <h3>🤖 Top AI Picks</h3>
          <button onClick={() => navigate('/search')}>See All</button>
        </div>
        <div className="property-scroll">
          {topPicks.map((p, i) => (
            <PropertyCardH key={p.id} property={p} gradient={gradients[(i + 2) % gradients.length]}
              matchScore={p.matchResult?.score} />
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <div className="section-header"><h3>🕐 Recently Viewed</h3></div>
          <div className="property-scroll">
            {recentlyViewed.map((p, i) => (
              <PropertyCardH key={p.id} property={p} gradient={gradients[(i + 4) % gradients.length]} />
            ))}
          </div>
        </div>
      )}

      {/* Popular Cities */}
      <div style={{ marginTop: '8px' }}>
        <div className="section-header"><h3>📍 Popular Cities</h3></div>
        <div className="city-grid">
          {popularCities.map(c => (
            <button key={c.name} className="city-card"
              onClick={() => navigate('/search', { state: { preferences: { city: c.name, state: c.state } } })}>
              <span className="city-emoji">{c.emoji}</span>
              <span className="city-name">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Browse by State */}
      <div style={{ marginTop: '8px' }}>
        <div className="section-header"><h3>🗺️ Browse by State</h3></div>
        <div style={{ padding: '0 16px 24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {states.filter(s => s !== 'All States').map(state => (
            <button key={state} className="filter-chip"
              onClick={() => navigate('/search', { state: { preferences: { state } } })}>
              {state}
            </button>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
