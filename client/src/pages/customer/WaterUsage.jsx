import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const WaterUsage = () => {
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const res = await api.get('/usage/history');
      setUsage(res.data.usage || []);
    } catch (error) {
      console.error('Error fetching usage:', error);
      alert(error.response?.data?.message || 'Failed to load water usage history');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
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
    heroTitle: {
      fontSize: '28px',
      marginBottom: '8px',
      fontWeight: '700'
    },
    heroText: {
      fontSize: '14px',
      color: '#cccccc'
    },
    tableCard: {
      background: '#ffffff',
      padding: '28px',
      border: '2px solid #000000',
      marginBottom: '30px',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      overflowX: 'auto'
    },
    tableStyle: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '850px'
    },
    thStyle: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '12px',
      textAlign: 'left',
      fontSize: '13px',
      fontWeight: '600',
      border: '1px solid #333333'
    },
    tdStyle: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '13px',
      color: '#333333'
    },
    statusPaid: {
      color: '#28a745',
      fontWeight: '700'
    },
    statusPending: {
      color: '#dc3545',
      fontWeight: '700'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.tableCard}>Loading water usage...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Water Usage History</h1>
        <p style={styles.heroText}>View your monthly water consumption and charged bill amount</p>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.thStyle}>Month</th>
              <th style={styles.thStyle}>Year</th>
              <th style={styles.thStyle}>Previous Reading</th>
              <th style={styles.thStyle}>Current Reading</th>
              <th style={styles.thStyle}>Consumption</th>
              <th style={styles.thStyle}>Amount</th>
              <th style={styles.thStyle}>Payment Status</th>
              <th style={styles.thStyle}>Reading Date</th>
            </tr>
          </thead>

          <tbody>
            {usage.length > 0 ? (
              usage.map((item) => {
                const amount = Number(
                  item.totalAmountDue ??
                  item.total_amount_due ??
                  item.amountCharged ??
                  item.amount ??
                  0
                );

                const status = item.paymentStatus || item.payment_status || 'pending';

                return (
                  <tr key={item.usageId || item.id}>
                    <td style={styles.tdStyle}>{item.month}</td>
                    <td style={styles.tdStyle}>{item.year}</td>
                    <td style={styles.tdStyle}>{Number(item.previousReading || 0).toFixed(2)} m³</td>
                    <td style={styles.tdStyle}>{Number(item.currentReading || item.meterReading || 0).toFixed(2)} m³</td>
                    <td style={styles.tdStyle}>{Number(item.consumption || 0).toFixed(2)} m³</td>
                    <td style={styles.tdStyle}>M {amount.toFixed(2)}</td>
                    <td style={styles.tdStyle}>
                      <span style={status === 'paid' ? styles.statusPaid : styles.statusPending}>
                        {status === 'paid' ? 'PAID' : 'NOT PAID'}
                      </span>
                    </td>
                    <td style={styles.tdStyle}>
                      {item.readingDate ? new Date(item.readingDate).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td style={styles.tdStyle} colSpan="8">
                  No water usage history available. Usage appears after a bill is generated.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WaterUsage;