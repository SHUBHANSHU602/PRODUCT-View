import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import s from './Auth.module.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getErrorMessage = (err) => {
    if (!err.response) return 'Cannot connect to server. Make sure backend is running.';
    const status = err.response.status;
    if (status === 401) return 'Invalid email or password';
    if (status === 404) return 'No account found with this email';
    return err.response?.data?.message || 'Login failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    }
    setLoading(false);
  };

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
    if (error) setError('');
  };

  return (
    <div className={s.page}>
      <div className={s.bgGradient} />

      <div className={s.card}>
        {/* Logo */}
        <div className={s.logo}>
          <span className={s.logoText} onClick={() => navigate('/')}>MockMate</span>
        </div>

        <h1 className={s.heading}>Welcome back</h1>
        <p className={s.subheading}>Sign in to continue your interview prep</p>

        {/* Error Banner */}
        {error && (
          <div className={s.errorBanner}>
            <span className={s.errorIcon}>⚠️</span>
            <span className={s.errorText}>{error}</span>
          </div>
        )}

        <form className={s.form} onSubmit={handleSubmit}>
          {/* Email */}
          <div className={s.inputGroup}>
            <label className={s.inputLabel}>Email</label>
            <div className={s.inputWrapper}>
              <input
                type="email"
                className={`${s.input} ${fieldErrors.email ? s.inputError : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className={s.fieldError}>{fieldErrors.email || ''}</div>
          </div>

          {/* Password */}
          <div className={s.inputGroup}>
            <label className={s.inputLabel}>Password</label>
            <div className={s.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`${s.input} ${s.inputWithToggle} ${fieldErrors.password ? s.inputError : ''}`}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={s.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <div className={s.fieldError}>{fieldErrors.password || ''}</div>
          </div>

          {/* Forgot password */}
          <div className={s.forgotRow}>
            <a href="#" className={s.forgotLink} onClick={e => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" className={s.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <span className={s.spinner} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className={s.footerText}>
          Don't have an account?{' '}
          <Link to="/register" className={s.footerLink}>Create one</Link>
        </p>
      </div>
    </div>
  );
}