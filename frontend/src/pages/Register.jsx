import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      // Registration only creates the account — send the user to Login
      // to sign in with their new credentials, like a real production site.
      navigate('/login', { state: { justRegistered: true, email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2>Create Your Account</h2>
        <p className="auth-subtitle">Join PharmaCare to order medicines and track prescriptions.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <User size={16} /> Full Name
            <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Your name" />
          </label>

          <label>
            <Mail size={16} /> Email
            <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </label>

          <label>
            <Phone size={16} /> Phone
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Optional" />
          </label>

          <label>
            <Lock size={16} /> Password
            <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
          </label>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : (<><UserPlus size={16} /> Register</>)}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;