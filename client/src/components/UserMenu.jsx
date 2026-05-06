import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// SVG Icons - No emojis
const AdminIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M2 17L12 22L22 17" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M2 12L12 17L22 12" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="8" r="3" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M3 17V16C3 13.5 5 12 7 12H11C13 12 15 13.5 15 16V17" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="7" r="2.5" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M21 17V16C21 14 19.5 12.5 18 12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 8V16M9 10H15M9 14H15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DatabaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="6" rx="8" ry="3" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M4 6V12C4 13.5 6.5 15 12 15C17.5 15 20 13.5 20 12V6" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M4 12V18C4 19.5 6.5 21 12 21C17.5 21 20 19.5 20 18V12" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="14" width="4" height="7" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <rect x="10" y="8" width="4" height="13" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <rect x="17" y="3" width="4" height="18" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const ReportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 5C4 3.5 5 3 6 3H18C19 3 20 3.5 20 5V19C20 20.5 19 21 18 21H6C5 21 4 20.5 4 19V5Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M8 7H16M8 11H14M8 15H12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20H3V9Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M9 20V14H15V20" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const BillIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H21V18H3V6Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M7 10H17M7 14H14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 7V12L15 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const WaterDropIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5C12 2.5 7 9.5 7 14C7 16.5 9 18.5 12 18.5C15 18.5 17 16.5 17 14C17 9.5 12 2.5 12 2.5Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const WrenchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 3L21 7.5M21 7.5L16.5 12L12 7.5M21 7.5L14 14.5C13 15.5 11.5 15.5 10.5 14.5L4.5 20.5L2.5 18.5L8.5 12.5C7.5 11.5 7.5 10 8.5 9L12 5.5" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3V12M12 12L15 9M12 12L9 9" stroke="#dc3545" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 12V19C19 20 18 21 17 21H7C6 21 5 20 5 19V12" stroke="#dc3545" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const UserMenu = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    onClose();
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'administrator':
        return [
          { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <AdminIcon /> },
          { label: 'User Management', path: '/admin/users', icon: <UsersIcon /> },
          { label: 'Billing Rates', path: '/admin/rates', icon: <MoneyIcon /> },
          { label: 'Database Status', path: '/admin/database', icon: <DatabaseIcon /> }
        ];
      case 'branch_manager':
        return [
          { label: 'Manager Dashboard', path: '/manager/dashboard', icon: <ChartIcon /> },
          { label: 'Reports', path: '/manager/reports', icon: <ReportIcon /> },
          { label: 'Customers', path: '/manager/customers', icon: <UsersIcon /> }
        ];
      default:
        return [
          { label: 'My Dashboard', path: '/customer/dashboard', icon: <HomeIcon /> },
          { label: 'My Bills', path: '/customer/bills', icon: <BillIcon /> },
          { label: 'Payment History', path: '/customer/payments', icon: <HistoryIcon /> },
          { label: 'Water Usage', path: '/customer/usage', icon: <WaterDropIcon /> },
          { label: 'Report Leakage', path: '/customer/report-leak', icon: <WrenchIcon /> }
        ];
    }
  };

  const styles = {
    dropdown: {
      position: 'absolute',
      top: '50px',
      right: '0',
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
      minWidth: '260px',
      zIndex: 1001,
      overflow: 'hidden',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    userInfo: {
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderBottom: '1px solid #e0e0e0'
    },
    avatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '18px'
    },
    userName: {
      fontWeight: 'bold',
      color: '#000000',
      fontSize: '14px'
    },
    userRole: {
      fontSize: '11px',
      color: '#666666',
      textTransform: 'capitalize'
    },
    divider: {
      height: '2px',
      backgroundColor: '#e0e0e0'
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      color: '#000000',
      textDecoration: 'none',
      transition: 'background 0.2s',
      fontSize: '13px',
      fontWeight: '500',
      borderBottom: '1px solid #eeeeee'
    },
    menuItemLast: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      color: '#000000',
      textDecoration: 'none',
      transition: 'background 0.2s',
      fontSize: '13px',
      fontWeight: '500',
      borderBottom: 'none'
    },
    logout: {
      width: '100%',
      padding: '12px 16px',
      textAlign: 'left',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#dc3545',
      fontSize: '13px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      width: '20px'
    }
  };

  const menuItems = getMenuItems();

  return (
    <div style={styles.dropdown}>
      <div style={styles.userInfo}>
        <div style={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
        <div>
          <div style={styles.userName}>{user?.name || 'User'}</div>
          <div style={styles.userRole}>{user?.role?.replace('_', ' ') || 'Customer'}</div>
        </div>
      </div>
      <div style={styles.divider}></div>
      {menuItems.map((item, index) => (
        <Link 
          key={index} 
          to={item.path} 
          style={index === menuItems.length - 1 ? styles.menuItemLast : styles.menuItem} 
          onClick={onClose}
        >
          <div style={styles.iconWrapper}>{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
      <div style={styles.divider}></div>
      <button onClick={handleLogout} style={styles.logout}>
        <div style={styles.iconWrapper}>
          <LogoutIcon />
        </div>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default UserMenu;