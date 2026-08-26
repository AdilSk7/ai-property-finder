import { useNavigate } from 'react-router-dom';

const sections = [
  {
    title: 'Terms of Service',
    icon: '📄',
    content: [
      { heading: '1. Acceptance of Terms', text: 'By using PropertyAI, you agree to these Terms of Service. If you do not agree, please do not use our platform.' },
      { heading: '2. Use of Platform', text: 'PropertyAI is a property discovery platform. You may use it to search, save, and schedule visits to properties. You agree not to misuse our platform for fraudulent or illegal activities.' },
      { heading: '3. Account Responsibility', text: 'You are responsible for maintaining the confidentiality of your account credentials. PropertyAI is not liable for any loss resulting from unauthorized access to your account.' },
      { heading: '4. Property Listings', text: 'Property details are provided in good faith. PropertyAI does not guarantee the accuracy of all listings and recommends verifying details directly with the property owner or developer.' },
      { heading: '5. Booking & Cancellations', text: 'Property visit bookings are subject to availability. Cancellations must be made at least 2 hours before the scheduled visit time. PropertyAI reserves the right to cancel visits in exceptional circumstances.' },
      { heading: '6. Modifications', text: 'PropertyAI reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.' },
    ]
  },
  {
    title: 'Privacy Policy',
    icon: '🔒',
    content: [
      { heading: '1. Information We Collect', text: 'We collect information you provide (name, email, phone) and usage data (properties viewed, searches made) to improve your experience.' },
      { heading: '2. How We Use Your Data', text: 'Your data is used to personalize property recommendations, send notifications, and improve our AI matching engine. We do not sell your personal information to third parties.' },
      { heading: '3. Firebase & Google Services', text: 'PropertyAI uses Firebase (by Google) for authentication and data storage. Your data is stored securely in Firebase Firestore and protected by Google\'s security infrastructure.' },
      { heading: '4. Data Retention', text: 'Your account data is retained as long as your account is active. You may request deletion of your data by contacting support@propertyai.in.' },
      { heading: '5. Cookies', text: 'We use local storage and session cookies to maintain your login state and preferences. These are essential for the app to function correctly.' },
      { heading: '6. Your Rights', text: 'You have the right to access, correct, or delete your personal information at any time. Contact our support team to exercise these rights.' },
    ]
  }
];

export default function TermsScreen() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: '90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <h2 style={{ flex: 1, fontSize: '18px', fontWeight: 700 }}>📄 Terms & Privacy</h2>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Last updated: August 2026. By using PropertyAI, you agree to the terms and policies below.
        </div>

        {sections.map((section, si) => (
          <div key={si} style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {section.icon} {section.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {section.content.map((item, ci) => (
                <div key={ci} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '6px' }}>{item.heading}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', padding: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          For questions, contact us at <span style={{ color: 'var(--primary-light)' }}>support@propertyai.in</span>
        </div>
      </div>
    </div>
  );
}
