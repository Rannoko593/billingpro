import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const CardIcon = ({ children }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    {children}
  </svg>
);

const UsersIcon = () => (
  <CardIcon>
    <circle cx="9" cy="8" r="3" stroke="#000" strokeWidth="1.5" />
    <path d="M3 18C3 14 6 12 9 12C12 12 15 14 15 18" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="17" cy="8" r="2.5" stroke="#000" strokeWidth="1.5" />
  </CardIcon>
);

const MoneyIcon = () => (
  <CardIcon>
    <circle cx="12" cy="12" r="8" stroke="#000" strokeWidth="1.5" />
    <path d="M12 8V16M9 10H15M9 14H15" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
  </CardIcon>
);

const ReportIcon = () => (
  <CardIcon>
    <path d="M5 3H19V21H5V3Z" stroke="#000" strokeWidth="1.5" />
    <path d="M8 8H16M8 12H14M8 16H12" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
  </CardIcon>
);

const WaterIcon = () => (
  <CardIcon>
    <path d="M12 2.5C12 2.5 7 9.5 7 14C7 17 9 19 12 19C15 19 17 17 17 14C17 9.5 12 2.5 12 2.5Z" stroke="#000" strokeWidth="1.5" />
  </CardIcon>
);

const DatabaseIcon = () => (
  <CardIcon>
    <ellipse cx="12" cy="6" rx="8" ry="3" stroke="#000" strokeWidth="1.5" />
    <path d="M4 6V18C4 20 8 21 12 21C16 21 20 20 20 18V6" stroke="#000" strokeWidth="1.5" />
  </CardIcon>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    activeManagers: 0,
    administrators: 0,
    totalRevenue: 0,
    pendingBills: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Admin stats error:', error);
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
      fontWeight: '700',
      letterSpacing: '-0.5px'
    },
    heroText: {
      fontSize: '14px',
      color: '#cccccc'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: '#ffffff',
      padding: '24px',
      border: '2px solid #000000',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    statTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    statValue: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#000000'
    },
    statLabel: {
      fontSize: '13px',
      color: '#666666'
    },
    sectionTitle: {
      fontSize: '22px',
      fontWeight: '700',
      margin: '35px 0 18px',
      color: '#000000'
    },
    actionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    actionCard: {
      background: '#ffffff',
      padding: '25px',
      border: '2px solid #000000',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      cursor: 'pointer'
    },
    actionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    actionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#000000'
    },
    actionText: {
      fontSize: '13px',
      color: '#666666',
      lineHeight: '1.5',
      marginBottom: '16px'
    },
    button: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '10px 18px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ padding: '60px', textAlign: 'center' }}>
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: <UsersIcon /> },
    { label: 'Customers', value: stats.totalCustomers || 0, icon: <UsersIcon /> },
    { label: 'Branch Managers', value: stats.activeManagers || 0, icon: <UsersIcon /> },
    { label: 'Administrators', value: stats.administrators || 0, icon: <UsersIcon /> },
    { label: 'Paid Revenue', value: `M ${Number(stats.totalRevenue || 0).toFixed(2)}`, icon: <MoneyIcon /> },
    { label: 'Pending Bills', value: stats.pendingBills || 0, icon: <ReportIcon /> }
  ];

  const adminActions = [
    {
      title: 'User Management',
      text: 'Add, edit, delete users and assign customer, manager or administrator roles.',
      icon: <UsersIcon />,
      path: '/admin/users'
    },
    {
      title: 'Billing Rates',
      text: 'Add, edit and delete water billing rate tiers used when calculating customer bills.',
      icon: <MoneyIcon />,
      path: '/admin/rates'
    },
    {
      title: 'Database Status',
      text: 'Check PostgreSQL connection and database health.',
      icon: <DatabaseIcon />,
      path: '/admin/database'
    }
  ];

  const managerActions = [
    {
      title: 'Manager Dashboard',
      text: 'View operational statistics, revenue, usage and leak reports.',
      icon: <ReportIcon />,
      path: '/manager/dashboard'
    },
    {
      title: 'Reports',
      text: 'Generate daily, weekly, monthly, quarterly and yearly water usage/billing reports.',
      icon: <ReportIcon />,
      path: '/manager/reports'
    },
    {
      title: 'Customers',
      text: 'View all customers, balances, usage and send notifications.',
      icon: <UsersIcon />,
      path: '/manager/customers'
    }
  ];

  const customerActions = [
    {
      title: 'Customer Bills',
      text: 'View customer bill interface and test payment flow.',
      icon: <MoneyIcon />,
      path: '/customer/bills'
    },
    {
      title: 'Payment History',
      text: 'View payment records and receipt download interface.',
      icon: <ReportIcon />,
      path: '/customer/payments'
    },
    {
      title: 'Water Usage',
      text: 'View customer water consumption page.',
      icon: <WaterIcon />,
      path: '/customer/usage'
    },
    {
      title: 'Leak Report',
      text: 'Access customer leakage reporting form.',
      icon: <WaterIcon />,
      path: '/customer/report-leak'
    }
  ];

  const renderActions = (actions) => (
    <div style={styles.actionGrid}>
      {actions.map((action) => (
        <div
          key={action.path}
          style={styles.actionCard}
          onClick={() => navigate(action.path)}
        >
          <div style={styles.actionHeader}>
            {action.icon}
            <div style={styles.actionTitle}>{action.title}</div>
          </div>

          <p style={styles.actionText}>{action.text}</p>

          <button style={styles.button}>
            Open
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Administrator Dashboard</h1>
        <p style={styles.heroText}>
          Admin has full access to administrator, manager and customer functions.
        </p>
      </div>

      <div style={styles.statsGrid}>
        {statCards.map((item) => (
          <div key={item.label} style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.statValue}>{item.value}</div>
              {item.icon}
            </div>
            <div style={styles.statLabel}>{item.label}</div>
          </div>
        ))}
      </div>

      <h2 style={styles.sectionTitle}>Admin Role Functions</h2>
      {renderActions(adminActions)}

      <h2 style={styles.sectionTitle}>Manager Role Functions</h2>
      {renderActions(managerActions)}

      <h2 style={styles.sectionTitle}>Customer Role Functions</h2>
      {renderActions(customerActions)}
    </div>
  );
};

export default AdminDashboard;