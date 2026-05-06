import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    accountNumber: '',
    phone: '',
    district: '',
    address: '', // ✅ ADDED
    role: 'customer',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getDashboardPath = (role) => {
    if (role === 'branch_manager') return '/manager/dashboard';
    return '/customer/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await api.post('/auth/register', form);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate(getDashboardPath(res.data.user.role));
      } else {
        alert('Registration successful. Please login.');
        navigate('/login');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
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
      boxSizing: 'border-box'
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
      <h2 style={styles.title}>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

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
          name="accountNumber"
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <select
          style={styles.input}
          name="district"
          value={form.district}
          onChange={handleChange}
          required
        >
          <option value="">Select District</option>
          <option value="Maseru">Maseru</option>
          <option value="Leribe">Leribe</option>
          <option value="Berea">Berea</option>
          <option value="Mafeteng">Mafeteng</option>
          <option value="Mohale's Hoek">Mohale's Hoek</option>
          <option value="Quthing">Quthing</option>
          <option value="Qacha's Nek">Qacha's Nek</option>
          <option value="Mokhotlong">Mokhotlong</option>
          <option value="Thaba-Tseka">Thaba-Tseka</option>
          <option value="Botha-Bothe">Botha-Bothe</option>
        </select>

        {/* ✅ ADDRESS FIELD */}
        <input
          style={styles.input}
          name="address"
          placeholder="Address (Village / Street / Area)"
          value={form.address}
          onChange={handleChange}
          required
        />

        <select
          style={styles.input}
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="customer">Customer</option>
          <option value="branch_manager">Branch Manager</option>
        </select>

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button style={styles.button} type="submit">
          Register
        </button>
      </form>

      <p style={styles.text}>
        Already have an account?{' '}
        <Link to="/login" style={styles.link}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;