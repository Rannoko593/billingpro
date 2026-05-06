import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const GenerateBill = () => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    accountNumber: '',
    month: 'April',
    year: new Date().getFullYear(),
    previousReading: '',
    currentReading: '',
    dueDate: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await api.get('/manager/customers');
    setCustomers(res.data.customers || []);
  };

  const generateBill = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.post('/billing/generate', form);
      alert(res.data.message || 'Bill generated successfully');

      setForm({
        accountNumber: '',
        month: 'April',
        year: new Date().getFullYear(),
        previousReading: '',
        currentReading: '',
        dueDate: ''
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate bill');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' },
    hero: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '40px',
      marginBottom: '30px',
      border: '2px solid #fff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    card: {
      background: '#fff',
      padding: '30px',
      border: '2px solid #000',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px'
    },
    label: { fontSize: '13px', fontWeight: '700', marginBottom: '6px' },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000',
      boxSizing: 'border-box',
      marginBottom: '15px'
    },
    button: {
      background: '#000',
      color: '#fff',
      border: '2px solid #000',
      padding: '12px 20px',
      cursor: 'pointer',
      fontWeight: '700',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    }
  };

  const consumption =
    form.currentReading !== '' && form.previousReading !== ''
      ? Number(form.currentReading) - Number(form.previousReading)
      : 0;

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1>Generate Customer Bill</h1>
        <p>Create water usage and pending bill for a customer</p>
      </div>

      <div style={styles.card}>
        <form onSubmit={generateBill}>
          <div style={styles.grid}>
            <div>
              <div style={styles.label}>Customer</div>
              <select
                style={styles.input}
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                required
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.accountNumber}>
                    {c.name} - {c.accountNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={styles.label}>Month</div>
              <select
                style={styles.input}
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <div style={styles.label}>Year</div>
              <input
                style={styles.input}
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </div>

            <div>
              <div style={styles.label}>Due Date</div>
              <input
                style={styles.input}
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />
            </div>

            <div>
              <div style={styles.label}>Previous Reading</div>
              <input
                style={styles.input}
                type="number"
                value={form.previousReading}
                onChange={(e) => setForm({ ...form, previousReading: e.target.value })}
                required
              />
            </div>

            <div>
              <div style={styles.label}>Current Reading</div>
              <input
                style={styles.input}
                type="number"
                value={form.currentReading}
                onChange={(e) => setForm({ ...form, currentReading: e.target.value })}
                required
              />
            </div>
          </div>

          <p><strong>Calculated Consumption:</strong> {consumption > 0 ? consumption : 0} m³</p>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Bill'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateBill;