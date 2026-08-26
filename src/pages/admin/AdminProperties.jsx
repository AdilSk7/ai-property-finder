import { useState, useEffect, useMemo } from 'react';
import { getAllProperties, addProperty, updateProperty, deleteProperty } from '../../utils/db';
import { states, getCitiesForState, getLocationsForCity, propertyTypes, furnishingOptions, possessionOptions, amenitiesList } from '../../data/properties';

const emptyForm = {
  name: '', state: 'Karnataka', location: 'Whitefield', city: 'Bangalore', price: '',
  bhk: 2, area: '', propertyType: 'Apartment', furnishing: 'Semi-Furnished',
  possession: 'Ready to Move', floor: '', facing: 'East', description: '',
  amenities: ['Parking', 'Security', 'Power Backup'], nearbyLandmarks: [''],
  commuteTime: {},
  developer: '', yearBuilt: new Date().getFullYear(), colorAccent: '#6366f1',
  priceFormatted: ''
};

function formatPriceLabel(price) {
  const p = Number(price);
  if (!p) return '';
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(p % 10000000 === 0 ? 0 : 1)}Cr`;
  return `₹${(p / 100000).toFixed(0)}L`;
}

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [view, setView] = useState('list'); // list, add, edit
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [toast, setToast] = useState('');

  useEffect(() => { refresh(); }, []);

  const refresh = async () => {
    const data = await getAllProperties();
    setProperties(data);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.area) {
      showToast('⚠️ Please fill required fields');
      return;
    }
    const data = {
      ...form,
      price: Number(form.price),
      bhk: Number(form.bhk),
      area: Number(form.area),
      priceFormatted: formatPriceLabel(form.price),
      nearbyLandmarks: form.nearbyLandmarks.filter(l => l.trim()),
      images: ['property_admin'],
    };

    try {
      if (view === 'edit') {
        await updateProperty(editId, data);
        showToast('✅ Property updated');
      } else {
        await addProperty(data);
        showToast('✅ Property added');
      }
      await refresh();
      setView('list');
      setForm({ ...emptyForm });
    } catch (e) {
      showToast('❌ Error saving property');
      console.error(e);
    }
  };

  const handleEdit = (prop) => {
    setForm({
      ...emptyForm,
      ...prop,
      price: String(prop.price),
      area: String(prop.area),
      bhk: prop.bhk,
      nearbyLandmarks: prop.nearbyLandmarks?.length ? prop.nearbyLandmarks : [''],
      commuteTime: prop.commuteTime || emptyForm.commuteTime
    });
    setEditId(prop.id);
    setView('edit');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this property?')) {
      try {
        await deleteProperty(id);
        await refresh();
        showToast('🗑️ Property deleted');
      } catch (e) {
        showToast('❌ Error deleting property');
        console.error(e);
      }
    }
  };

  const updateField = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val };
      if (key === 'state') { 
        const cities = getCitiesForState(val);
        next.city = cities[1] || '';
        const locs = getLocationsForCity(next.city);
        next.location = locs[1] || '';
      }
      if (key === 'city') {
        const locs = getLocationsForCity(val);
        next.location = locs[1] || '';
      }
      return next;
    });
  };

  const formCities = useMemo(() => getCitiesForState(form.state).filter(c => c !== 'All Cities'), [form.state]);
  const formLocations = useMemo(() => getLocationsForCity(form.city).filter(l => l !== 'All Locations'), [form.city]);

  const toggleAmenity = (a) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
    }));
  };

  // ── FORM VIEW ──
  if (view === 'add' || view === 'edit') {
    return (
      <div className="admin-screen">
        {toast && <div className="toast">{toast}</div>}
        <div className="search-screen-header">
          <button className="back-btn" onClick={() => { setView('list'); setForm({ ...emptyForm }); }}>←</button>
          <h2>{view === 'edit' ? 'Edit Property' : 'Add Property'}</h2>
        </div>

        <div className="filter-section">
          <label>Property Name *</label>
          <input className="filter-input" value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Prestige Lakeside" />
        </div>

        <div className="filter-section">
          <label>State</label>
          <select className="filter-select" value={form.state} onChange={e => updateField('state', e.target.value)}>
            {states.filter(s => s !== 'All States').map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="filter-section">
            <label>City</label>
            <select className="filter-select" value={form.city} onChange={e => updateField('city', e.target.value)}>
              {formCities.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-section">
            <label>Location</label>
            <select className="filter-select" value={form.location} onChange={e => updateField('location', e.target.value)}>
              {formLocations.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="filter-section">
            <label>Price (₹) *</label>
            <input className="filter-input" type="number" value={form.price} onChange={e => updateField('price', e.target.value)} placeholder="e.g. 8500000" />
            {form.price && <span style={{ fontSize: '11px', color: 'var(--primary-light)', marginTop: '4px', display: 'block' }}>{formatPriceLabel(form.price)}</span>}
          </div>
          <div className="filter-section">
            <label>Area (sq.ft) *</label>
            <input className="filter-input" type="number" value={form.area} onChange={e => updateField('area', e.target.value)} placeholder="e.g. 1200" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="filter-section">
            <label>BHK</label>
            <select className="filter-select" value={form.bhk} onChange={e => updateField('bhk', Number(e.target.value))}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} BHK</option>)}
            </select>
          </div>
          <div className="filter-section">
            <label>Type</label>
            <select className="filter-select" value={form.propertyType} onChange={e => updateField('propertyType', e.target.value)}>
              {propertyTypes.filter(t => t !== 'All Types').map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="filter-section">
            <label>Furnishing</label>
            <select className="filter-select" value={form.furnishing} onChange={e => updateField('furnishing', e.target.value)}>
              {furnishingOptions.filter(f => f !== 'Any').map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="filter-section">
            <label>Possession</label>
            <select className="filter-select" value={form.possession} onChange={e => updateField('possession', e.target.value)}>
              {possessionOptions.filter(p => p !== 'Any').map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="filter-section">
            <label>Floor</label>
            <input className="filter-input" value={form.floor} onChange={e => updateField('floor', e.target.value)} placeholder="e.g. 5th of 12" />
          </div>
          <div className="filter-section">
            <label>Facing</label>
            <select className="filter-select" value={form.facing} onChange={e => updateField('facing', e.target.value)}>
              {['East','West','North','South','North-East','North-West','South-East','South-West'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="filter-section">
            <label>Developer</label>
            <input className="filter-input" value={form.developer} onChange={e => updateField('developer', e.target.value)} placeholder="Builder name" />
          </div>
          <div className="filter-section">
            <label>Year Built</label>
            <input className="filter-input" type="number" value={form.yearBuilt} onChange={e => updateField('yearBuilt', Number(e.target.value))} />
          </div>
        </div>

        <div className="filter-section">
          <label>Description</label>
          <textarea className="filter-input" style={{ minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => updateField('description', e.target.value)} placeholder="Describe the property..." />
        </div>

        <div className="filter-section">
          <label>Amenities</label>
          <div className="amenity-grid">
            {amenitiesList.map(a => (
              <div key={a} className={`amenity-check ${form.amenities.includes(a) ? 'selected' : ''}`} onClick={() => toggleAmenity(a)}>
                <span className="check-icon">{form.amenities.includes(a) ? '✓' : ''}</span>
                {a}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label>Nearby Landmarks</label>
          {form.nearbyLandmarks.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <input className="filter-input" value={l} onChange={e => {
                const arr = [...form.nearbyLandmarks];
                arr[i] = e.target.value;
                updateField('nearbyLandmarks', arr);
              }} placeholder="e.g. ITPL - 2 km" />
              {form.nearbyLandmarks.length > 1 && (
                <button className="back-btn" style={{ flexShrink: 0 }} onClick={() => updateField('nearbyLandmarks', form.nearbyLandmarks.filter((_, j) => j !== i))}>✕</button>
              )}
            </div>
          ))}
          <button className="filter-chip" style={{ width: '100%', textAlign: 'center', marginTop: '4px' }}
            onClick={() => updateField('nearbyLandmarks', [...form.nearbyLandmarks, ''])}>
            + Add Landmark
          </button>
        </div>

        <div className="filter-section">
          <label>Commute Times (minutes)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[['whitefield','Whitefield'],['electronicCity','Electronic City'],['koramangala','Koramangala'],['mgRoad','MG Road']].map(([k,l]) => (
              <div key={k}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l}</span>
                <input className="filter-input" type="number" value={form.commuteTime[k] || ''} onChange={e => updateField('commuteTime', { ...form.commuteTime, [k]: Number(e.target.value) })} placeholder="min" />
              </div>
            ))}
          </div>
        </div>

        <button className="search-btn" onClick={handleSubmit} style={{ marginTop: '8px', marginBottom: '20px' }}>
          {view === 'edit' ? '✓ Update Property' : '+ Add Property'}
        </button>
      </div>
    );
  }

  // ── LIST VIEW ──
  return (
    <div className="admin-screen">
      {toast && <div className="toast">{toast}</div>}
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Properties</h2>
          <p className="admin-subtitle">{properties.length} total properties</p>
        </div>
        <button className="search-btn" style={{ width: 'auto', padding: '10px 16px', fontSize: '13px', marginTop: 0 }}
          onClick={() => { setForm({ ...emptyForm }); setView('add'); }}>
          + Add
        </button>
      </div>

      {properties.map(prop => (
        <div key={prop.id} className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="admin-list-title">{prop.name}</div>
              <div className="admin-list-sub">📍 {prop.location}, {prop.city} • {prop.bhk} BHK • {prop.area} sq.ft</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-light)', marginTop: '2px' }}>{prop.priceFormatted || formatPriceLabel(prop.price)}</div>
            </div>
            <span className={`admin-badge ${prop.possession === 'Ready to Move' ? 'confirmed' : 'pending'}`}>
              {prop.possession === 'Ready to Move' ? 'Ready' : 'UC'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn-view" style={{ flex: 1, fontSize: '12px', padding: '8px' }} onClick={() => handleEdit(prop)}>✏️ Edit</button>
            <button className="btn-view" style={{ flex: 1, fontSize: '12px', padding: '8px', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => handleDelete(prop.id)}>🗑️ Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
