import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookVisit } from '../utils/db';

function generateVisitId() {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `VISIT-${dateStr}-${seq}`;
}

export default function BookVisitModal({ property, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // form, summary, success
  const [form, setForm] = useState({
    date: '',
    time: '10:00',
    visitors: '1',
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    notes: ''
  });
  const [booking, setBooking] = useState(null);

  const handleNext = () => {
    if (!form.date || !form.name || !form.phone || !form.email) return;
    setStep('summary');
  };

  const handleConfirm = async () => {
    if (!user) return; // Must be logged in

    const newBooking = await bookVisit(
      user.uid,
      form.name,
      form.email,
      form.phone,
      property,
      form
    );

    setBooking(newBooking);
    setStep('success');
  };

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const timeLabels = {
    '09:00': '9:00 AM', '10:00': '10:00 AM', '11:00': '11:00 AM',
    '12:00': '12:00 PM', '14:00': '2:00 PM', '15:00': '3:00 PM',
    '16:00': '4:00 PM', '17:00': '5:00 PM'
  };

  // ── SUCCESS SCREEN ──
  if (step === 'success') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-handle" />
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h2>Visit Booked Successfully!</h2>
            <p>Your property visit has been scheduled. Our team will contact you shortly to confirm.</p>

            <div className="success-details">
              <div className="success-detail-row">
                <span className="label">Visit ID</span>
                <span className="value" style={{ color: 'var(--primary-light)' }}>
                  {booking?.visitId}
                </span>
              </div>
              <div className="success-detail-row">
                <span className="label">Property</span>
                <span className="value">{property.name}</span>
              </div>
              <div className="success-detail-row">
                <span className="label">Location</span>
                <span className="value">{property.location}, Bangalore</span>
              </div>
              <div className="success-detail-row">
                <span className="label">Date</span>
                <span className="value">{formatDate(form.date)}</span>
              </div>
              <div className="success-detail-row">
                <span className="label">Time</span>
                <span className="value">{timeLabels[form.time] || form.time}</span>
              </div>
              <div className="success-detail-row">
                <span className="label">Visitors</span>
                <span className="value">{form.visitors}</span>
              </div>
              <div className="success-detail-row">
                <span className="label">Visitor Name</span>
                <span className="value">{form.name}</span>
              </div>
            </div>

            <button
              className="success-btn"
              onClick={() => { onClose(); navigate('/bookings'); }}
            >
              📅 View My Visits
            </button>
            <button
              className="success-btn"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                marginTop: '8px'
              }}
              onClick={() => { onClose(); navigate('/search'); }}
            >
              🏠 Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SUMMARY SCREEN ──
  if (step === 'summary') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-handle" />
          <h2>📋 Booking Summary</h2>
          <p className="modal-subtitle">Please review your visit details before confirming</p>

          <div className="success-details" style={{ margin: '16px 0' }}>
            <div className="success-detail-row">
              <span className="label">Property</span>
              <span className="value">{property.name}</span>
            </div>
            <div className="success-detail-row">
              <span className="label">Location</span>
              <span className="value">{property.location}, Bangalore</span>
            </div>
            <div className="success-detail-row">
              <span className="label">Price</span>
              <span className="value">{property.priceFormatted}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
            <div className="success-detail-row">
              <span className="label">Visit Date</span>
              <span className="value">{formatDate(form.date)}</span>
            </div>
            <div className="success-detail-row">
              <span className="label">Visit Time</span>
              <span className="value">{timeLabels[form.time] || form.time}</span>
            </div>
            <div className="success-detail-row">
              <span className="label">No. of Visitors</span>
              <span className="value">{form.visitors}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
            <div className="success-detail-row">
              <span className="label">Name</span>
              <span className="value">{form.name}</span>
            </div>
            <div className="success-detail-row">
              <span className="label">Phone</span>
              <span className="value">{form.phone}</span>
            </div>
            <div className="success-detail-row">
              <span className="label">Email</span>
              <span className="value">{form.email}</span>
            </div>
            {form.notes && (
              <div className="success-detail-row">
                <span className="label">Notes</span>
                <span className="value">{form.notes}</span>
              </div>
            )}
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            fontSize: '12px',
            color: 'var(--warning)',
            lineHeight: 1.5,
            marginBottom: '4px'
          }}>
            ⚠️ Free cancellation is available up to 2 hours before the scheduled visit.
          </div>

          <div className="modal-actions">
            <button className="modal-cancel" onClick={() => setStep('form')}>
              ← Edit
            </button>
            <button id="confirm-booking" className="modal-confirm" onClick={handleConfirm}>
              ✓ Confirm Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FORM SCREEN ──
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2>📅 Book a Visit</h2>
        <p className="modal-subtitle">Schedule a visit to {property.name}</p>

        <div className="form-group">
          <label>Visit Date & Time</label>
          <div className="date-time-row">
            <input
              id="booking-date"
              className="filter-input"
              type="date"
              min={getTomorrowDate()}
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
            <select
              id="booking-time"
              className="filter-select"
              value={form.time}
              onChange={e => setForm({ ...form, time: e.target.value })}
            >
              {Object.entries(timeLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Number of Visitors</label>
          <select
            id="booking-visitors"
            className="filter-select"
            value={form.visitors}
            onChange={e => setForm({ ...form, visitors: e.target.value })}
          >
            <option value="1">1 Person</option>
            <option value="2">2 People</option>
            <option value="3">3 People</option>
            <option value="4">4 People</option>
            <option value="5">5+ People</option>
          </select>
        </div>

        <div className="form-group">
          <label>Your Name</label>
          <input
            id="booking-name"
            className="filter-input"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            id="booking-phone"
            className="filter-input"
            type="tel"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            id="booking-email"
            className="filter-input"
            type="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Additional Notes (Optional)</label>
          <input
            id="booking-notes"
            className="filter-input"
            type="text"
            placeholder="Any specific requirements..."
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button
            id="booking-next"
            className="modal-confirm"
            onClick={handleNext}
            disabled={!form.date || !form.name || !form.phone || !form.email}
            style={{ opacity: (!form.date || !form.name || !form.phone || !form.email) ? 0.5 : 1 }}
          >
            Review Booking →
          </button>
        </div>
      </div>
    </div>
  );
}
