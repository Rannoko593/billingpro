import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const DatabaseStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/database/status');
      setStatus(res.data.status || null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load database status');
    } finally {
      setLoading(false);
    }
  };

  const syncDatabase = async () => {
    try {
      setSyncing(true);
      const res = await api.post('/admin/database/sync');
      alert(res.data.message || 'Database synchronized successfully');
      fetchStatus();
    } catch (error) {
      alert(error.response?.data?.message || 'Database sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const isPrimaryOnline =
    status?.connection === 'Connected' ||
    status?.primaryStatus === 'Connected' ||
    status?.primary?.status === 'Connected';

  const isSecondaryOnline =
    status?.secondaryStatus === 'Connected' ||
    status?.secondary?.status === 'Connected' ||
    status?.connection === 'Connected';

  const tables = status?.tables || {};

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
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '25px',
      marginBottom: '30px'
    },
    card: {
      background: '#fff',
      border: '2px solid #000',
      padding: '25px',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '12px'
    },
    badgeOnline: {
      display: 'inline-block',
      padding: '6px 12px',
      background: '#000',
      color: '#fff',
      fontWeight: '700',
      fontSize: '12px',
      border: '2px solid #000'
    },
    badgeOffline: {
      display: 'inline-block',
      padding: '6px 12px',
      background: '#fff',
      color: '#000',
      fontWeight: '700',
      fontSize: '12px',
      border: '2px solid #000'
    },
    tableCard: {
      background: '#fff',
      border: '2px solid #000',
      padding: '25px',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      marginBottom: '30px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      background: '#000',
      color: '#fff',
      padding: '12px',
      textAlign: 'left',
      border: '1px solid #333'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd'
    },
    button: {
      background: '#000',
      color: '#fff',
      border: '2px solid #000',
      padding: '12px 20px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.tableCard}>Loading database status...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1>Database Status</h1>
        <p>Primary database and backup/reporting fragment status</p>
      </div>

      <div style={styles.cardGrid}>
        <div style={styles.card}>
          <div style={styles.title}>Primary Database</div>
          <p>{status?.primaryDatabase || 'PostgreSQL'}</p>
          <span style={isPrimaryOnline ? styles.badgeOnline : styles.badgeOffline}>
            {isPrimaryOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        <div style={styles.card}>
          <div style={styles.title}>Second Database / Fragment</div>
          <p>{status?.secondaryDatabase || 'Backup / Reporting Fragment'}</p>
          <span style={isSecondaryOnline ? styles.badgeOnline : styles.badgeOffline}>
            {isSecondaryOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      <div style={styles.tableCard}>
        <h3>Stored Records</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Entity</th>
              <th style={styles.th}>Records</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={styles.td}>Customers</td>
              <td style={styles.td}>{tables.customers || 0}</td>
            </tr>
            <tr>
              <td style={styles.td}>Bills</td>
              <td style={styles.td}>{tables.bills || 0}</td>
            </tr>
            <tr>
              <td style={styles.td}>Payments</td>
              <td style={styles.td}>{tables.payments || 0}</td>
            </tr>
            <tr>
              <td style={styles.td}>Water Usage</td>
              <td style={styles.td}>{tables.waterUsage || tables.water_usage || 0}</td>
            </tr>
            <tr>
              <td style={styles.td}>Billing Rates</td>
              <td style={styles.td}>{tables.billingRates || tables.billing_rates || 0}</td>
            </tr>
            <tr>
              <td style={styles.td}>Leak Reports</td>
              <td style={styles.td}>{tables.leakReports || tables.leak_reports || 0}</td>
            </tr>
            <tr>
              <td style={styles.td}>Notifications</td>
              <td style={styles.td}>{tables.notifications || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={styles.tableCard}>
        <h3>Synchronization</h3>
        <p>
          Last Sync:{' '}
          {status?.lastSync
            ? new Date(status.lastSync).toLocaleString()
            : 'Not synchronized yet'}
        </p>

        <button style={styles.button} onClick={syncDatabase} disabled={syncing}>
          {syncing ? 'Synchronizing...' : 'Synchronize Backup Fragment'}
        </button>
      </div>
    </div>
  );
};

export default DatabaseStatus;