import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    try {
      const response = await axios.post('/api/auth/login', form);
      
      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      const fieldErrors = error.response?.data?.errors || {};
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      } else {
        setErrors({ general: errorMessage });
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Login to EXIVOX</h2>
      
      {errors.general && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c33' }}>
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Email</label>
          <input 
            name="email" 
            type="email"
            placeholder="Enter your email" 
            value={form.email} 
            onChange={handleChange} 
            required
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: errors.email ? '2px solid #f56565' : '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          {errors.email && <span style={{ color: '#f56565', fontSize: '0.875rem' }}>{errors.email}</span>}
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="Enter your password" 
            value={form.password} 
            onChange={handleChange} 
            required
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: errors.password ? '2px solid #f56565' : '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          {errors.password && <span style={{ color: '#f56565', fontSize: '0.875rem' }}>{errors.password}</span>}
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            backgroundColor: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>Sign up here</Link>
      </p>
    </div>
  );
}