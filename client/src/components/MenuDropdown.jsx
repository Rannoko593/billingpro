import React from 'react';
import { Link } from 'react-router-dom';

// SVG Icons - No emojis
const LoginIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3V12M12 12L15 9M12 12L9 9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M19 12V19C19 20 18 21 17 21H7C6 21 5 20 5 19V12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const RegisterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V16M8 12H16" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="8" r="4" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M5 20V19C5 15 8 13 12 13C16 13 19 15 19 19V20" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MenuDropdown = ({ onClose }) => {
  const styles = {
    dropdown: {
      position: 'absolute',
      top: '50px',
      right: '0',
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
      minWidth: '180px',
      zIndex: 1001,
      overflow: 'hidden',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      color: '#000000',
      textDecoration: 'none',
      transition: 'background 0.2s',
      fontSize: '13px',
      fontWeight: '600',
      borderBottom: '1px solid #e0e0e0'
    },
    menuItemLast: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      color: '#000000',
      textDecoration: 'none',
      transition: 'background 0.2s',
      fontSize: '13px',
      fontWeight: '600',
      borderBottom: 'none'
    },
    icon: {
      display: 'flex',
      alignItems: 'center'
    }
  };

  return (
    <div style={styles.dropdown}>
      <Link to="/login" style={styles.menuItem} onClick={onClose}>
        <div style={styles.icon}>
          <LoginIcon />
        </div>
        LOGIN
      </Link>
      <Link to="/register" style={styles.menuItemLast} onClick={onClose}>
        <div style={styles.icon}>
          <RegisterIcon />
        </div>
        REGISTER
      </Link>
    </div>
  );
};

export default MenuDropdown;