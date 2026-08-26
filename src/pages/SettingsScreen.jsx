import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailAlerts: true,
    priceDropAlerts: true,
    newPropertyAlerts: false,
    visitReminders: true,
    darkMode: true,
    language: 'English',
    currency: 'INR (₹)',
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ToggleRow = ({ label, subtitle, settingKey }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {subtitle && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</div>}
      </div>
      <div
        onClick={() => toggle(settingKey)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px',
          background: settings[settingKey] ? 'var(--primary)' : 'var(--border)',
          position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', flexShrink: 0
        }}
      >
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%', background: 'white',
          position: 'absolute', top: '3px',
          left: settings[settingKey] ? '23px' : '3px',
          transition: 'left 0.3s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
        }} />
      </div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0 16px', marginBottom: '16px' }}>
      <div style={{ padding: '12px 0 8px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{title}</div>
      {children}
    </div>
  );

  return (
    <div style={{ paddingBottom: '90px' }}>
      {saved && <div className="toast">✅ Settings saved!</div>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <h2 style={{ flex: 1, fontSize: '18px', fontWeight: 700 }}>⚙️ Settings</h2>
      </div>

      <div style={{ padding: '20px' }}>
        <Section title="Notifications">
          <ToggleRow label="Push Notifications" subtitle="Receive alerts on your device" settingKey="pushNotifications" />
          <ToggleRow label="Email Alerts" subtitle="Get updates via email" settingKey="emailAlerts" />
          <ToggleRow label="Price Drop Alerts" subtitle="Notify when saved property prices fall" settingKey="priceDropAlerts" />
          <ToggleRow label="New Property Alerts" subtitle="Notify about new listings in your area" settingKey="newPropertyAlerts" />
          <ToggleRow label="Visit Reminders" subtitle="Remind before scheduled property visits" settingKey="visitReminders" />
        </Section>

        <Section title="Appearance">
          <ToggleRow label="Dark Mode" subtitle="Use dark theme across the app" settingKey="darkMode" />
        </Section>

        <Section title="Preferences">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Language</div>
            <select value={settings.language} onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontFamily: 'var(--font)' }}>
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Tamil</option>
              <option>Kannada</option>
              <option>Marathi</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Currency</div>
            <select value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontFamily: 'var(--font)' }}>
              <option>INR (₹)</option>
              <option>USD ($)</option>
            </select>
          </div>
        </Section>

        <Section title="Data & Privacy">
          <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>Clear Search History</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>Remove all your recent searches and viewed properties</div>
            <button style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '12px', fontFamily: 'var(--font)', cursor: 'pointer' }}>
              Clear History
            </button>
          </div>
          <div style={{ padding: '14px 0' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>App Version</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>PropertyAI v1.0.0</div>
          </div>
        </Section>

        <button onClick={handleSave} className="btn-book" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}
