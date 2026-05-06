import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Icon = ({ children }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    {children}
  </svg>
);

const DashboardIcon = () => (
  <Icon>
    <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </Icon>
);

const UsersIcon = () => (
  <Icon>
    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 18C3 14 6 12 9 12C12 12 15 14 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </Icon>
);

const MoneyIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 8V16M9 10H15M9 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </Icon>
);

const ReportIcon = () => (
  <Icon>
    <path d="M5 3H19V21H5V3Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 8H16M8 12H14M8 16H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </Icon>
);

const WaterIcon = () => (
  <Icon>
    <path d="M12 2.5C12 2.5 7 9.5 7 14C7 17 9 19 12 19C15 19 17 17 17 14C17 9.5 12 2.5 12 2.5Z" stroke="currentColor" strokeWidth="1.5" />
  </Icon>
);

const LeakIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 7V13M12 17H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </Icon>
);

const DatabaseIcon = () => (
  <Icon>
    <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 6V18C4 20 8 21 12 21C16 21 20 20 20 18V6" stroke="currentColor" strokeWidth="1.5" />
  </Icon>
);

const BellIcon = () => (
  <Icon>
    <path d="M18 16V11C18 7.7 16.1 5.1 13.5 4.4V4C13.5 3.2 12.8 2.5 12 2.5C11.2 2.5 10.5 3.2 10.5 4V4.4C7.9 5.1 6 7.7 6 11V16L4 18V19H20V18L18 16Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 20C10.4 21.1 11.1 21.5 12 21.5C12.9 21.5 13.6 21.1 14 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </Icon>
);

const InboxIcon = () => (
  <Icon>
    <path d="M4 4H20V20H4V4Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 14H8L10 17H14L16 14H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </Icon>
);

const LogoutIcon = () => (
  <Icon>
    <path d="M12 3V12M12 12L15 9M12 12L9 9" stroke="#dc3545" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19 12V19C19 20 18 21 17 21H7C6 21 5 20 5 19V12" stroke="#dc3545" strokeWidth="1.5" strokeLinecap="round" />
  </Icon>
);

const roleLabel = {
  administrator: 'Administrator',
  branch_manager: 'Branch Manager',
  customer: 'Customer'
};

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
  const role = storedUser?.role;

  const menus = {
    administrator: [
      { section: 'Admin Role' },
      { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
      { label: 'User Management', path: '/admin/users', icon: <UsersIcon /> },
      { label: 'Billing Rates', path: '/admin/rates', icon: <MoneyIcon /> },
      { label: 'Bill Payments', path: '/admin/payments', icon: <MoneyIcon /> },
      { label: 'Notifications', path: '/admin/notifications', icon: <BellIcon /> },
      { label: 'Inbox', path: '/notifications', icon: <InboxIcon /> },
      { label: 'Database Status', path: '/admin/database', icon: <DatabaseIcon /> },

      { section: 'Manager Role' },
      { label: 'Manager Dashboard', path: '/manager/dashboard', icon: <DashboardIcon /> },
      { label: 'Generate Bill', path: '/manager/generate-bill', icon: <MoneyIcon /> },
      { label: 'Reports', path: '/manager/reports', icon: <ReportIcon /> },
      { label: 'Customers', path: '/manager/customers', icon: <UsersIcon /> },

      { section: 'Customer Role' },
      { label: 'Customer Dashboard', path: '/customer/dashboard', icon: <DashboardIcon /> },
      { label: 'Bills', path: '/customer/bills', icon: <ReportIcon /> },
      { label: 'Payments', path: '/customer/payments', icon: <MoneyIcon /> },
      { label: 'Water Usage', path: '/customer/usage', icon: <WaterIcon /> },
      { label: 'Report Leakage', path: '/customer/report-leak', icon: <LeakIcon /> }
    ],

    branch_manager: [
      { label: 'Dashboard', path: '/manager/dashboard', icon: <DashboardIcon /> },
      { label: 'Generate Bill', path: '/manager/generate-bill', icon: <MoneyIcon /> },
      { label: 'Reports', path: '/manager/reports', icon: <ReportIcon /> },
      { label: 'Customers', path: '/manager/customers', icon: <UsersIcon /> },
      { label: 'Notifications', path: '/manager/notifications', icon: <BellIcon /> },
      { label: 'Inbox', path: '/notifications', icon: <InboxIcon /> }
    ],

    customer: [
      { label: 'Dashboard', path: '/customer/dashboard', icon: <DashboardIcon /> },
      { label: 'My Bills', path: '/customer/bills', icon: <ReportIcon /> },
      { label: 'Payment History', path: '/customer/payments', icon: <MoneyIcon /> },
      { label: 'Water Usage', path: '/customer/usage', icon: <WaterIcon /> },
      { label: 'Report Leakage', path: '/customer/report-leak', icon: <LeakIcon /> },
      { label: 'Inbox', path: '/notifications', icon: <InboxIcon /> }
    ]
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout?.();
    navigate('/');
  };

  const styles = {
    sidebar: {
      width: '260px',
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '2px solid #333'
    },
    userInfo: {
      padding: '0 20px 20px',
      borderBottom: '2px solid #333',
      marginBottom: '20px'
    },
    avatar: {
      width: '50px',
      height: '50px',
      backgroundColor: '#fff',
      color: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '20px',
      marginBottom: '12px'
    },
    name: {
      fontWeight: '700',
      fontSize: '16px',
      marginBottom: '4px'
    },
    role: {
      fontSize: '12px',
      color: '#aaa'
    },
    section: {
      padding: '16px 20px 6px',
      fontSize: '11px',
      color: '#999',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      color: '#ccc',
      textDecoration: 'none',
      fontSize: '14px'
    },
    active: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      textDecoration: 'none',
      fontSize: '14px',
      borderLeft: '3px solid #fff'
    },
    logout: {
      marginTop: 'auto',
      borderTop: '2px solid #333',
      padding: '16px 20px',
      color: '#dc3545',
      cursor: 'pointer',
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      fontWeight: '600'
    }
  };

  if (!role) return null;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.userInfo}>
        <div style={styles.avatar}>
          {storedUser?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div style={styles.name}>{storedUser?.name || 'User'}</div>
        <div style={styles.role}>{roleLabel[role] || role}</div>
      </div>

      <nav>
        {(menus[role] || []).map((item, index) => {
          if (item.section) {
            return <div key={index} style={styles.section}>{item.section}</div>;
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              style={location.pathname === item.path ? styles.active : styles.link}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={styles.logout} onClick={handleLogout}>
        <LogoutIcon />
        Logout
      </div>
    </aside>
  );
};

export default Sidebar;