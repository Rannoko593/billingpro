import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/my');
      setNotifications(res.data.notifications || []);
    } catch (error) {
      alert('Failed to load notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      alert('Failed to mark as read');
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Delete this notification?')) return;

    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      alert('Failed to delete notification');
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    hero: {
      backgroundColor: '#000',
      color: '#fff',
      padding: '40px',
      marginBottom: '30px',
      border: '2px solid #fff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    title: {
      fontSize: '26px',
      fontWeight: '700'
    },
    tableWrapper: {
      background: '#fff',
      border: '2px solid #000',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      background: '#000',
      color: '#fff',
      padding: '12px',
      border: '1px solid #333',
      textAlign: 'left',
      fontSize: '13px'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      fontSize: '13px'
    },
    badge: {
      padding: '4px 8px',
      border: '1px solid #000',
      fontSize: '11px',
      fontWeight: '700'
    },
    unread: {
      background: '#000',
      color: '#fff'
    },
    read: {
      background: '#fff',
      color: '#000'
    },
    btn: {
      padding: '6px 10px',
      border: '2px solid #000',
      cursor: 'pointer',
      fontSize: '12px',
      marginRight: '6px'
    },
    btnPrimary: {
      background: '#000',
      color: '#fff'
    },

    // 🔴 DELETE BUTTON STYLE
    btnDanger: {
      background: '#dc3545',   // red
      color: '#fff',
      border: '2px solid #dc3545'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Inbox</h1>
        <p>All notifications sent to your account</p>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Location of Leak</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Urgency Level</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <tr key={n.notification_id}>
                  <td style={styles.td}>{n.title || '—'}</td>

                  <td style={styles.td}>{n.message}</td>

                  <td style={styles.td}>{n.type || 'normal'}</td>

                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.badge,
                        ...(n.is_read ? styles.read : styles.unread)
                      }}
                    >
                      {n.is_read ? 'READ' : 'NEW'}
                    </span>
                  </td>

                  <td style={styles.td}>
                    {!n.is_read && (
                      <button
                        style={{ ...styles.btn, ...styles.btnPrimary }}
                        onClick={() => markAsRead(n.notification_id)}
                      >
                        Read
                      </button>
                    )}

                    <button
                      style={{ ...styles.btn, ...styles.btnDanger }}
                      onClick={() => deleteNotification(n.notification_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="5">
                  No notifications available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyNotifications;