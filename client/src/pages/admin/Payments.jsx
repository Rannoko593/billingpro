import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data.payments || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load payments');
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
    hero: {
      background: '#000',
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
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      overflowX: 'auto'
    },
    table: { width: '100%', borderCollapse: 'collapse', minWidth: '1000px' },
    th: {
      background: '#000',
      color: '#fff',
      padding: '12px',
      textAlign: 'left',
      border: '1px solid #333'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      fontSize: '13px'
    },
    paid: {
      color: '#28a745',
      fontWeight: '700'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1>Bill Payments</h1>
        <p>View all customer water bill payments</p>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Payment ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Account</th>
              <th style={styles.th}>Bill</th>
              <th style={styles.th}>Month</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Receipt</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p.payment_id}>
                  <td style={styles.td}>#{p.payment_id}</td>
                  <td style={styles.td}>{p.name || 'Unknown'}</td>
                  <td style={styles.td}>{p.account_number}</td>
                  <td style={styles.td}>#{p.bill_id}</td>
                  <td style={styles.td}>{p.month} {p.year}</td>
                  <td style={styles.td}>M {Number(p.amount_paid || 0).toFixed(2)}</td>
                  <td style={styles.td}>{p.payment_method}</td>
                  <td style={styles.td}>{p.receipt_number}</td>
                  <td style={styles.td}>
                    {p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.paid}>{p.payment_status}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="10">No payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;