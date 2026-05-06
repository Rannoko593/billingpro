import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState({ accountNumber: '', title: '', message: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/manager/customers');
      setCustomers(response.data.customers || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load customers');
    }
  };

  const sendNotification = async () => {
    if (!notification.accountNumber || !notification.title || !notification.message) {
      alert('Choose customer and enter title/message');
      return;
    }

    try {
      await api.post('/manager/notifications', {
        ...notification,
        type: 'customer_notice'
      });
      setNotification({ accountNumber: '', title: '', message: '' });
      alert('Notification sent');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send notification');
    }
  };

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.accountNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
    hero: { backgroundColor: '#000', color: '#fff', padding: '40px', marginBottom: '30px' },
    card: { background: '#fff', padding: '30px', border: '2px solid #000', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)', marginBottom: '30px' },
    input: { width: '100%', padding: '12px', border: '2px solid #000', marginBottom: '12px', boxSizing: 'border-box' },
    button: { background: '#000', color: '#fff', padding: '12px 20px', border: '2px solid #000', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { background: '#000', color: '#fff', padding: '12px', textAlign: 'left' },
    td: { padding: '12px', borderBottom: '1px solid #ddd' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1>Customers</h1>
        <p>View customer usage, balances and send notifications</p>
      </div>

      <div style={styles.card}>
        <h3>Send Customer Notification</h3>

        <select
          style={styles.input}
          value={notification.accountNumber}
          onChange={(e) => setNotification({ ...notification, accountNumber: e.target.value })}
        >
          <option value="">Select Customer</option>
          <option value="ALL">All Customers</option>
          {customers.map((c) => (
            <option key={c.id} value={c.accountNumber}>
              {c.name} - {c.accountNumber}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          placeholder="Title"
          value={notification.title}
          onChange={(e) => setNotification({ ...notification, title: e.target.value })}
        />

        <textarea
          style={{ ...styles.input, minHeight: '90px' }}
          placeholder="Message"
          value={notification.message}
          onChange={(e) => setNotification({ ...notification, message: e.target.value })}
        />

        <button style={styles.button} onClick={sendNotification}>
          Send Notification
        </button>
      </div>

      <div style={styles.card}>
        <input
          style={styles.input}
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Account</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>District</th>
              <th style={styles.th}>Usage</th>
              <th style={styles.th}>Outstanding</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td style={styles.td}>{c.name}</td>
                <td style={styles.td}>{c.accountNumber}</td>
                <td style={styles.td}>{c.email}</td>
                <td style={styles.td}>{c.phone || 'N/A'}</td>
                <td style={styles.td}>{c.district || 'N/A'}</td>
                <td style={styles.td}>{c.totalConsumption} m³</td>
                <td style={styles.td}>M {c.outstandingBalance}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td style={styles.td} colSpan="7">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;