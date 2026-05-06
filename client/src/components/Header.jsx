import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  };

  const user = getUser();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token && !!user;

  const goToDashboard = () => {
    if (!isLoggedIn) {
      setMenuOpen(false);
      navigate('/login');
      return;
    }

    if (user.role === 'administrator') navigate('/admin/dashboard');
    else if (user.role === 'branch_manager') navigate('/manager/dashboard');
    else navigate('/customer/dashboard');

    setMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  const styles = {
    header: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '0 80px',
      height: '65px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '2px solid #ffffff',
      position: 'relative',
      zIndex: 1000
    },
    logoBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
      color: '#ffffff'
    },
    logo: {
      fontSize: '24px',
      fontWeight: '800'
    },
    smallText: {
      fontSize: '10px',
      color: '#cccccc'
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '28px'
    },
    navLink: {
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: '700'
    },
    menuBtn: {
      backgroundColor: '#ffffff',
      color: '#000000',
      border: '2px solid #ffffff',
      width: '42px',
      height: '38px',
      cursor: 'pointer',
      fontSize: '22px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dropdown: {
      position: 'absolute',
      top: '65px',
      right: '80px',
      width: '220px',
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
      boxShadow: '6px 6px 0 rgba(0,0,0,0.15)',
      zIndex: 1001
    },
    dropdownItem: {
      display: 'block',
      width: '100%',
      padding: '12px 16px',
      backgroundColor: '#ffffff',
      border: 'none',
      borderBottom: '1px solid #dddddd',
      color: '#000000',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '700',
      textDecoration: 'none',
      boxSizing: 'border-box'
    }
  };

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoBox}>
        <span style={{ fontSize: '20px' }}>♢</span>
        <span style={styles.logo}>WASCO</span>
        <span style={styles.smallText}>Water & Sewerage Company</span>
      </Link>

      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink}>HOME</Link>
        <Link to="/about" style={styles.navLink}>ABOUT US</Link>
        <Link to="/tips" style={styles.navLink}>TIPS</Link>
        <Link to="/contact" style={styles.navLink}>CONTACT US</Link>
      </nav>

      <button
        style={styles.menuBtn}
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {menuOpen && (
        <div style={styles.dropdown}>
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                style={styles.dropdownItem}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                style={styles.dropdownItem}
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <button style={styles.dropdownItem} onClick={goToDashboard}>
                Dashboard
              </button>

              <button style={styles.dropdownItem} onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;