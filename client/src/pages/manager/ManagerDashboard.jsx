import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [report, setReport] = useState(null);
  const [notification, setNotification] = useState({
    accountNumber: 'ALL',
    title: '',
    message: '',
    type: 'manager_notice'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/manager/stats');
      setStats(response.data.stats);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load manager dashboard');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      const response = await api.get(`/manager/reports/${period}`);
      setReport(response.data.report);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate report');
    }
  };

  const sendNotification = async () => {
    if (!notification.title || !notification.message) {
      alert('Title and message are required');
      return;
    }

    try {
      await api.post('/manager/notifications', notification);
      setNotification({
        accountNumber: 'ALL',
        title: '',
        message: '',
        type: 'manager_notice'
      });
      alert('Notification sent successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send notification');
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
    hero: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '40px',
      marginBottom: '30px',
      border: '2px solid #ffffff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    title: { fontSize: '28px', marginBottom: '8px', fontWeight: '700' },
    text: { fontSize: '14px', color: '#cccccc' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' },
    card: {
      background: '#ffffff',
      padding: '25px',
      border: '2px solid #000000',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      marginBottom: '30px'
    },
    statValue: { fontSize: '26px', fontWeight: '700', marginBottom: '6px' },
    statLabel: { fontSize: '13px', color: '#666666' },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000000',
      fontSize: '13px',
      boxSizing: 'border-box',
      marginBottom: '12px'
    },
    button: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '12px 20px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { backgroundColor: '#000', color: '#fff', padding: '12px', textAlign: 'left' },
    td: { padding: '12px', borderBottom: '1px solid #ddd' }
  };

  if (loading) return <div style={styles.container}>Loading dashboard...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Manager Dashboard</h1>
        <p style={styles.text}>View WASCO operational insights, reports, customers and notifications</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.statValue}>{stats?.totalCustomers || 0}</div>
          <div style={styles.statLabel}>Customers</div>
        </div>

        <div style={styles.card}>
          <div style={styles.statValue}>M {stats?.totalPaid || 0}</div>
          <div style={styles.statLabel}>Paid Revenue</div>
        </div>

        <div style={styles.card}>
          <div style={styles.statValue}>M {stats?.outstanding || 0}</div>
          <div style={styles.statLabel}>Outstanding</div>
        </div>

        <div style={styles.card}>
          <div style={styles.statValue}>{stats?.activeLeaks || 0}</div>
          <div style={styles.statLabel}>Active Leak Reports</div>
        </div>
      </div>

      <div style={styles.formGrid}>
        <div style={styles.card}>
          <h3>Generate Report</h3>

          <select style={styles.input} value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="daily">Daily Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="quarterly">Quarterly Report</option>
            <option value="yearly">Yearly Report</option>
          </select>

          <button style={styles.button} onClick={generateReport}>
            Generate Report
          </button>

          {report && (
            <table style={styles.table}>
              <tbody>
                <tr><td style={styles.td}>Customers</td><td style={styles.td}>{report.customers}</td></tr>
                <tr><td style={styles.td}>Total Usage</td><td style={styles.td}>{report.totalUsage} m³</td></tr>
                <tr><td style={styles.td}>Total Billed</td><td style={styles.td}>M {report.totalBilled}</td></tr>
                <tr><td style={styles.td}>Total Paid</td><td style={styles.td}>M {report.totalPaid}</td></tr>
                <tr><td style={styles.td}>Outstanding</td><td style={styles.td}>M {report.outstanding}</td></tr>
                <tr><td style={styles.td}>Collection Rate</td><td style={styles.td}>{report.collectionRate}%</td></tr>
              </tbody>
            </table>
          )}
        </div>

        <div style={styles.card}>
          <h3>Send Notification</h3>

          <input
            style={styles.input}
            placeholder="Account number or ALL"
            value={notification.accountNumber}
            onChange={(e) => setNotification({ ...notification, accountNumber: e.target.value })}
          />

          <input
            style={styles.input}
            placeholder="Notification title"
            value={notification.title}
            onChange={(e) => setNotification({ ...notification, title: e.target.value })}
          />

          <textarea
            style={{ ...styles.input, minHeight: '100px' }}
            placeholder="Notification message"
            value={notification.message}
            onChange={(e) => setNotification({ ...notification, message: e.target.value })}
          />

          <button style={styles.button} onClick={sendNotification}>
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;