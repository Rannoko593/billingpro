import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const Notifications = () => {
  const loggedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const role = loggedUser?.role;

  const [receivers, setReceivers] = useState([]);
  const [audit, setAudit] = useState([]);

  const [form, setForm] = useState({
    target: role === 'branch_manager' ? 'ALL_CUSTOMERS' : 'ALL',
    title: '',
    message: '',
    type: role === 'branch_manager' ? 'manager_notice' : 'admin_notice'
  });

  useEffect(() => {
    fetchReceivers();

    if (role === 'administrator') {
      fetchAudit();
    }
  }, [role]);

  const fetchReceivers = async () => {
    try {
      const res = await api.get('/notifications/receivers');
      setReceivers(res.data.users || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load receivers');
    }
  };

  const fetchAudit = async () => {
    try {
      const res = await api.get('/notifications/audit');
      setAudit(res.data.notifications || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load notification audit');
    }
  };

  const sendNotification = async () => {
    if (!form.target || !form.title || !form.message) {
      alert('Please fill in target, title and message');
      return;
    }

    try {
      const res = await api.post('/notifications/send', form);

      alert(`Notification sent to ${res.data.recipients || 1} receiver(s)`);

      setForm({
        target: role === 'branch_manager' ? 'ALL_CUSTOMERS' : 'ALL',
        title: '',
        message: '',
        type: role === 'branch_manager' ? 'manager_notice' : 'admin_notice'
      });

      if (role === 'administrator') {
        fetchAudit();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send notification');
    }
  };

  const filteredReceivers =
    role === 'branch_manager'
      ? receivers.filter((u) => u.role === 'customer')
      : receivers;

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
    card: {
      background: '#ffffff',
      padding: '30px',
      border: '2px solid #000000',
      marginBottom: '30px',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      overflowX: 'auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000000',
      boxSizing: 'border-box',
      marginBottom: '12px',
      fontSize: '13px',
      backgroundColor: '#ffffff'
    },
    button: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '12px 20px',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: '13px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '900px'
    },
    th: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '12px',
      textAlign: 'left',
      border: '1px solid #333333',
      fontSize: '13px'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #dddddd',
      fontSize: '13px'
    },
    read: {
      color: '#28a745',
      fontWeight: '700'
    },
    unread: {
      color: '#dc3545',
      fontWeight: '700'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Notifications</h1>
        <p style={styles.heroText}>
          {role === 'administrator'
            ? 'Send notifications and track who received and viewed them.'
            : 'Send notifications to customers.'}
        </p>
      </div>

      <div style={styles.card}>
        <h3>Send Notification</h3>

        <div style={styles.grid}>
          <div>
            <select
              style={styles.input}
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
            >
              {role === 'administrator' && (
                <>
                  <option value="ALL">All Users</option>
                  <option value="ALL_CUSTOMERS">All Customers</option>
                  <option value="ALL_MANAGERS">All Managers</option>
                  <option value="ALL_ADMINS">All Admins</option>
                </>
              )}

              {role === 'branch_manager' && (
                <option value="ALL_CUSTOMERS">All Customers</option>
              )}

              {filteredReceivers.map((user) => (
                <option key={user.customer_id} value={user.account_number}>
                  {user.name} - {user.role} - {user.account_number}
                </option>
              ))}
            </select>

            <input
              style={styles.input}
              placeholder="Notification title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <select
              style={styles.input}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="admin_notice">Admin Notice</option>
              <option value="manager_notice">Manager Notice</option>
              <option value="bill_notice">Bill Notice</option>
              <option value="payment_notice">Payment Notice</option>
              <option value="maintenance">Maintenance</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div>
            <textarea
              style={{ ...styles.input, minHeight: '135px' }}
              placeholder="Notification message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <button style={styles.button} onClick={sendNotification}>
              Send Notification
            </button>
          </div>
        </div>
      </div>

      {role === 'administrator' && (
        <div style={styles.card}>
          <h3>Notification Delivery and View Status</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Receiver</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Sent By</th>
                <th style={styles.th}>Received At</th>
                <th style={styles.th}>Viewed</th>
                <th style={styles.th}>Read Time</th>
              </tr>
            </thead>

            <tbody>
              {audit.length > 0 ? (
                audit.map((n) => (
                  <tr key={n.notification_id}>
                    <td style={styles.td}>
                      <strong>{n.title}</strong>
                      <div>{n.message}</div>
                    </td>

                    <td style={styles.td}>
                      {n.receiver_name || 'Unknown'}
                      <div>{n.receiver_account_number}</div>
                    </td>

                    <td style={styles.td}>{n.receiver_role || 'Unknown'}</td>

                    <td style={styles.td}>
                      {n.sender_name || 'System'}
                      <div>{n.sender_role}</div>
                    </td>

                    <td style={styles.td}>
                      {new Date(n.created_at).toLocaleString()}
                    </td>

                    <td style={styles.td}>
                      <span style={n.is_read ? styles.read : styles.unread}>
                        {n.is_read ? 'Viewed' : 'Not viewed'}
                      </span>
                    </td>

                    <td style={styles.td}>
                      {n.read_at ? new Date(n.read_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.td} colSpan="7">
                    No notifications sent yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Notifications;