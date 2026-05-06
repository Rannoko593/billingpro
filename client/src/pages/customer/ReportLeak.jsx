import React, { useState } from 'react';
import api from '../../utils/api';

const ReportLeak = () => {
  const [form, setForm] = useState({
    location: '',
    description: '',
    urgency: 'normal'
  });

  const [loading, setLoading] = useState(false);

  const submitReport = async (e) => {
    e.preventDefault();

    if (!form.location || !form.description || !form.urgency) {
      alert('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      await api.post('/reports/leak', form);

      alert('Leak report submitted successfully. Managers and admins have been notified.');

      setForm({
        location: '',
        description: '',
        urgency: 'normal'
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit leak report');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 20px'
    },
    hero: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '40px',
      marginBottom: '30px',
      border: '2px solid #ffffff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '8px'
    },
    text: {
      fontSize: '14px',
      color: '#cccccc'
    },
    card: {
      background: '#ffffff',
      padding: '30px',
      border: '2px solid #000000',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    label: {
      fontSize: '13px',
      fontWeight: '700',
      marginBottom: '6px',
      display: 'block'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000000',
      marginBottom: '18px',
      boxSizing: 'border-box'
    },
    button: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '12px 20px',
      cursor: 'pointer',
      fontWeight: '700',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Report Leakage</h1>
        <p style={styles.text}>Submit water leakage reports to WASCO managers and admins</p>
      </div>

      <div style={styles.card}>
        <form onSubmit={submitReport}>
          <label style={styles.label}>Location of Leak</label>
          <input
            style={styles.input}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Example: Maseru West, near main road"
          />

          <label style={styles.label}>Description</label>
          <textarea
            style={{ ...styles.input, minHeight: '120px' }}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the leak problem"
          />

          <label style={styles.label}>Urgency Level</label>
          <select
            style={styles.input}
            value={form.urgency}
            onChange={(e) => setForm({ ...form, urgency: e.target.value })}
          >
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="emergency">Emergency</option>
          </select>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Leak Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportLeak;