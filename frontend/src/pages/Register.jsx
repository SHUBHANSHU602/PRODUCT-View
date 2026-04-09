import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import s from './Auth.module.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getErrorMessage = (err) => {
    if (!err.response) return 'Cannot connect to server. Make sure backend is running.';
    return err.response?.data?.message || 'Registration failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Show success animation, then redirect
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
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
        {/* Success overlay */}
        {success && (
          <div className={s.successOverlay}>
            <div className={s.successCheck}>✓</div>
            <div className={s.successText}>Account Created!</div>
            <div className={s.successSub}>Redirecting to dashboard...</div>
          </div>
        )}

        {/* Logo */}
        <div className={s.logo}>
          <span className={s.logoText} onClick={() => navigate('/')}>MockMate</span>
        </div>

        <h1 className={s.heading}>Create your account</h1>
        <p className={s.subheading}>Start acing your interviews with AI</p>

        {/* Error Banner */}
        {error && (
          <div className={s.errorBanner}>
            <span className={s.errorIcon}>⚠️</span>
            <span className={s.errorText}>{error}</span>
          </div>
        )}

        <form className={s.form} onSubmit={handleSubmit}>
          {/* Name */}
          <div className={s.inputGroup}>
            <label className={s.inputLabel}>Full Name</label>
            <div className={s.inputWrapper}>
              <input
                type="text"
                className={`${s.input} ${fieldErrors.name ? s.inputError : ''}`}
                placeholder="John Doe"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className={s.fieldError}>{fieldErrors.name || ''}</div>
          </div>

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
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className={s.inputGroup}>
            <label className={s.inputLabel}>Confirm Password</label>
            <div className={s.inputWrapper}>
              <input
                type={showConfirm ? 'text' : 'password'}
                className={`${s.input} ${s.inputWithToggle} ${fieldErrors.confirmPassword ? s.inputError : ''}`}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={s.togglePassword}
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            <div className={s.fieldError}>{fieldErrors.confirmPassword || ''}</div>
          </div>

          {/* Submit */}
          <button type="submit" className={s.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <span className={s.spinner} />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className={s.footerText}>
          Already have an account?{' '}
          <Link to="/login" className={s.footerLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}