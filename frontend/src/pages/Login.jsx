import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: location.state?.email || '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Log in to manage your medicines and orders.</p>

        {location.state?.justRegistered && (
          <div className="auth-success">
            <CheckCircle size={16} /> Account created! Please log in to continue.
          </div>
        )}

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <Mail size={16} /> Email
            <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </label>

          <label>
            <Lock size={16} /> Password
            <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
          </label>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : (<><LogIn size={16} /> Login</>)}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;