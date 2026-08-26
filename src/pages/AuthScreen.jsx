import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = await login(email, password);
      if (!result.success) setError(result.message);
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        return;
      }
      const result = await signup(name, email, password, phone);
      if (!result.success) setError(result.message);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-logo">
        <div className="auth-logo-icon">🏠</div>
        <h1>PropertyAI</h1>
        <p>Smart Property Finding Experience</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {isLogin ? 'Sign in to continue your property search' : 'Join us to find your dream home'}
        </p>

        {error && (
          <div className="auth-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {!isLogin && (
          <div className="auth-input-group">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              className="auth-input"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        )}

        <div className="auth-input-group">
          <label htmlFor="auth-email">Email Address</label>
          <input
            id="auth-email"
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-input-group">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            className="auth-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {!isLogin && (
          <div className="auth-input-group">
            <label htmlFor="signup-phone">Phone Number</label>
            <input
              id="signup-phone"
              className="auth-input"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
        )}

        <button id="auth-submit" className="auth-btn" type="submit">
          {isLogin ? 'Sign In →' : 'Create Account →'}
        </button>
      </form>

      <div className="auth-switch">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          id="auth-toggle"
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
