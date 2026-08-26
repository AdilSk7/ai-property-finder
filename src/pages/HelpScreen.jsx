import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const faqs = [
  { q: 'How does AI property matching work?', a: 'Our AI analyzes your preferences (budget, location, BHK, amenities) and scores each property using a weighted algorithm. Properties with higher match scores appear at the top of your search results.' },
  { q: 'How do I save a property?', a: 'On any property card or detail page, tap the ❤️ heart icon to save it to your Favorites. You can view all saved properties from the Favorites tab.' },
  { q: 'Can I cancel a scheduled visit?', a: 'Yes! Go to My Visits in your profile, find the booking you want to cancel, and tap "Cancel Visit". Cancellations must be made at least 2 hours before the scheduled time.' },
  { q: 'How do I contact the property agent?', a: 'On the property detail page, scroll down to find the "Contact Agent" or "Schedule Visit" button. Our team will connect you with the property owner directly.' },
  { q: 'Are all property listings verified?', a: 'Yes, all properties listed on PropertyAI go through a verification process. Properties with the "✅ Verified" badge have been personally inspected by our team.' },
  { q: 'How do I search properties in a specific location?', a: 'Use the Search tab and expand the filters. Select your State → City → Location from the cascading dropdowns to narrow results to your exact preferred area.' },
];

export default function HelpScreen() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div style={{ paddingBottom: '90px' }}>
      {sent && <div className="toast">✅ Message sent! We'll reply within 24 hours.</div>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <h2 style={{ flex: 1, fontSize: '18px', fontWeight: 700 }}>❓ Help & Support</h2>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Quick Contact */}
        <div style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏠</div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>PropertyAI Support</h3>
          <p style={{ fontSize: '13px', opacity: 0.8, marginBottom: '14px' }}>We're here to help Mon–Sat, 9AM–6PM</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href="tel:+918001234567" style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '13px', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📞 Call Us
            </a>
            <a href="mailto:support@propertyai.in" style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '13px', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✉️ Email Us
            </a>
          </div>
        </div>

        {/* FAQs */}
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
          Frequently Asked Questions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font)', gap: '12px' }}
              >
                <span>{faq.q}</span>
                <span style={{ transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'none', flexShrink: 0, color: 'var(--primary-light)' }}>▼</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 16px 14px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
          Send Us a Message
        </h3>
        <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Describe your issue or question..."
            rows={4}
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '12px', fontSize: '13px', fontFamily: 'var(--font)', resize: 'none', boxSizing: 'border-box' }}
          />
          <button onClick={handleSend} className="btn-book" style={{ width: '100%', marginTop: '12px', padding: '12px' }}>
            📤 Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
