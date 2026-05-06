import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getDashboardPath = (role) => {
    if (role === 'administrator') return '/admin/dashboard';
    if (role === 'branch_manager') return '/manager/dashboard';
    return '/customer/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate(getDashboardPath(res.data.user.role));
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  const styles = {
    container: {
      maxWidth: '420px',
      margin: '40px auto',
      padding: '30px',
      border: '2px solid #000000',
      background: '#ffffff',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    title: {
      textAlign: 'center',
      fontSize: '26px',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#000000'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '14px',
      border: '2px solid #000000',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff'
    },
    button: {
      width: '100%',
      padding: '12px',
      background: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      cursor: 'pointer',
      fontWeight: '700',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    text: {
      textAlign: 'center',
      marginTop: '16px',
      fontSize: '13px'
    },
    link: {
      color: '#000000',
      fontWeight: '700'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button style={styles.button} type="submit">
          Login
        </button>
      </form>

      <p style={styles.text}>
        Don’t have an account?{' '}
        <Link to="/register" style={styles.link}>
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;