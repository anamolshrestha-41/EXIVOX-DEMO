import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
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
      const response = await axios.post('/api/auth/signup', form);
      
      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
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
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Join EXIVOX</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Full Name</label>
          <input 
            name="name" 
            type="text"
            placeholder="Enter your full name" 
            value={form.name} 
            onChange={handleChange} 
            required
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        
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
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="Create a password" 
            value={form.password} 
            onChange={handleChange} 
            required
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Role</label>
          <select 
            name="role" 
            value={form.role} 
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
            <option value="institution">Institution</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Sign Up
        </button>
      </form>
      
      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
        Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login here</Link>
      </p>
    </div>
  );
}