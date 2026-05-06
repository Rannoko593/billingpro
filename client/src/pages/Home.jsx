import React, { useState, useEffect } from 'react';

// Simple SVG Icon Components - All Black Color
const WaterDropIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5L12 2.5C12 2.5 7 9.5 7 14C7 16.5 9 18.5 12 18.5C15 18.5 17 16.5 17 14C17 9.5 12 2.5 12 2.5Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 15.5C13.5 15.5 14.5 14.5 14.5 13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 8V16M9 10H15M9 14H15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 6V8M12 16V18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ReportIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12M12 16H12.01" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="9" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 4L12 2M12 22V20" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="8" r="3" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M3 17V16C3 13.5 5 12 7 12H11C13 12 15 13.5 15 16V17" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="7" r="2.5" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M21 17V16C21 14 19.5 12.5 18 12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const WaterFlowIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L12 22M12 2L8 6M12 2L16 6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 12H19" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 18H16" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13L9 17L19 7" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const FactoryIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="16" height="8" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M6 12V8L10 10L14 6V8L18 5V12" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M8 16H10M14 16H16" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DamIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20H20" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 20V10C6 8 7 6.5 9 6L12 5L15 6C17 6.5 18 8 18 10V20" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M9 16H15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 12H14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SmartMeterIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="3" width="12" height="18" rx="2" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M9 7H15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 19.5V20" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="14" r="2" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.5 18.5H14.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 21H14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 15V18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 3C8.5 3 5.5 5.5 5.5 9.5C5.5 12 7 14 8.5 15.5C9 16 9.5 16.5 9.5 17.5H14.5C14.5 16.5 15 16 15.5 15.5C17 14 18.5 12 18.5 9.5C18.5 5.5 15.5 3 12 3Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="14" width="4" height="7" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <rect x="10" y="8" width="4" height="13" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <rect x="17" y="3" width="4" height="18" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const NewsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 5C4 3.5 5 3 6 3H18C19 3 20 3.5 20 5V19C20 20.5 19 21 18 21H6C5 21 4 20.5 4 19V5Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M8 7H16M8 11H14M8 15H12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="10" r="3" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 2C8 2 5 5 5 9C5 13 12 22 12 22C12 22 19 13 19 9C19 5 16 2 12 2Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 3H9.5L11.5 8L9 10C10 13 13 16 16 16L18 13.5L23 15.5V18.5C23 20 21.5 22 20 22C10 22 2 14 2 4C2 2.5 4 1 5.5 1H8.5L10.5 6L8.5 8.5" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M22 7L12 14L2 7" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12C21 13.5 20.5 15 19.5 16C18.5 17 17 17.5 15.5 17.5H11L7 21V17.5C5 17 3.5 15.5 3 13.5C2.5 11.5 3 9 4.5 7" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="11" r="1.5" fill="#000000"/>
    <circle cx="12" cy="11" r="1.5" fill="#000000"/>
    <circle cx="17" cy="11" r="1.5" fill="#000000"/>
  </svg>
);

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    if (token && userData) {
      setLoggedIn(true);
      setUser(userData);
    }
  }, []);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    // Hero Section - Black Background
    hero: {
      backgroundColor: '#000000',
      padding: '80px 60px',
      marginBottom: '50px',
      textAlign: 'center',
      border: '2px solid #FFFFFF',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    heroTitle: {
      fontSize: '56px',
      marginBottom: '20px',
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: '-0.5px'
    },
    heroSubtitle: {
      fontSize: '20px',
      marginBottom: '16px',
      color: '#CCCCCC'
    },
    heroText: {
      fontSize: '16px',
      opacity: '0.8',
      maxWidth: '600px',
      margin: '0 auto',
      color: '#CCCCCC'
    },
    // Dashboard Grid for Logged-in Users
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '30px',
      marginTop: '24px',
      marginBottom: '60px'
    },
    // Card Styles - Classic Black and White with Shadow
    card: {
      background: '#ffffff',
      padding: '30px',
      border: '2px solid #000000',
      textAlign: 'center',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    cardBlack: {
      background: '#000000',
      padding: '30px',
      border: '2px solid #FFFFFF',
      textAlign: 'center',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)',
      color: '#ffffff'
    },
    cardTitle: {
      fontSize: '22px',
      marginBottom: '16px',
      color: '#000000',
      fontWeight: '700'
    },
    cardTitleWhite: {
      fontSize: '22px',
      marginBottom: '16px',
      color: '#ffffff',
      fontWeight: '700'
    },
    statNumber: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#000000',
      margin: '16px 0'
    },
    btnPrimary: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '12px 28px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '16px',
      width: '100%',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    btnSecondary: {
      backgroundColor: '#ffffff',
      color: '#000000',
      border: '2px solid #000000',
      padding: '12px 28px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '16px',
      width: '100%',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    announcementBar: {
      backgroundColor: '#f5f5f5',
      padding: '16px 20px',
      marginBottom: '24px',
      borderLeft: '4px solid #000000',
      color: '#000000',
      border: '1px solid #000000',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.05)'
    },
    widgetContainer: {
      display: 'flex',
      gap: '16px',
      marginTop: '16px',
      flexWrap: 'wrap'
    },
    inputStyle: {
      flex: 1,
      padding: '12px',
      border: '2px solid #000000',
      fontSize: '14px',
      background: '#ffffff'
    },
    tableStyle: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    twoColumnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '30px',
      marginBottom: '60px'
    },
    threeColumnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '30px',
      marginBottom: '60px'
    },
    fourColumnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '30px',
      marginBottom: '60px'
    },
    iconBox: {
      textAlign: 'center',
      padding: '20px',
      border: '2px solid #000000',
      background: '#ffffff',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.05)'
    },
    iconWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '12px'
    },
    statBox: {
      textAlign: 'center',
      padding: '30px',
      border: '2px solid #000000',
      background: '#ffffff',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    divider: {
      height: '2px',
      backgroundColor: '#000000',
      margin: '20px 0'
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    badge: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '4px 12px',
      fontSize: '12px',
      fontWeight: '600',
      border: '1px solid #000000'
    },
    contactButtonGroup: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '20px'
    },
    contactButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#ffffff',
      color: '#000000',
      border: '2px solid #000000',
      padding: '12px 28px',
      cursor: 'pointer',
      fontWeight: '600',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '32px',
      textAlign: 'center',
      marginBottom: '30px',
      color: '#000000',
      fontWeight: '700',
      letterSpacing: '-0.5px'
    },
    sectionTitleUnderline: {
      width: '60px',
      height: '3px',
      backgroundColor: '#000000',
      margin: '15px auto 40px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section - Centered Black Background */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>WASCO</h1>
        <p style={styles.heroSubtitle}>Water and Sewerage Company of Lesotho</p>
        <p style={styles.heroText}>Providing clean, safe water and professional sewerage services to all districts of the Kingdom of Lesotho since 1999</p>
      </div>

      {/* Announcement Bar */}
      <div style={styles.announcementBar}>
        <strong>LATEST ANNOUNCEMENT:</strong> Scheduled maintenance in Maseru district on 25th April 2026 from 9AM to 3PM. Please store water in advance.
      </div>

      {/* Water Advisory Alert */}
      <div style={{ ...styles.announcementBar, backgroundColor: '#ffffff', borderLeftColor: '#000000' }}>
        <strong>WATER ADVISORY:</strong> Low water pressure expected in Leribe and Berea districts due to pipeline upgrades. Estimated restoration by Friday.
      </div>

      {/* Dashboard for Logged-in Users */}
      {loggedIn && (
        <div style={styles.dashboardGrid}>
          <div style={styles.card}>
            <div style={styles.iconWrapper}><WaterDropIcon /></div>
            <h3 style={styles.cardTitle}>Real-time Water Usage</h3>
            <div style={styles.statNumber}>24.5 m³</div>
            <p>This month so far</p>
            <p style={{ fontSize: '12px', color: '#666666' }}>Last month: 28.2 m³ down 13%</p>
          </div>

          <div style={styles.card}>
            <div style={styles.iconWrapper}><MoneyIcon /></div>
            <h3 style={styles.cardTitle}>Outstanding Balance</h3>
            <div style={styles.statNumber}>M 185.50</div>
            <p>Due by: 30 April 2026</p>
            <button style={styles.btnPrimary}>PAY NOW</button>
          </div>

          <div style={styles.card}>
            <div style={styles.iconWrapper}><ReportIcon /></div>
            <h3 style={styles.cardTitle}>Report Leakage</h3>
            <p>Help us save water by reporting leaks in your area</p>
            <button style={styles.btnSecondary}>REPORT VIA WHATSAPP</button>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <div style={styles.fourColumnGrid}>
        <div style={styles.statBox}>
          <div style={styles.iconWrapper}><UsersIcon /></div>
          <div style={styles.statNumber}>124,567</div>
          <p>Total Customers</p>
          <p style={{ fontSize: '12px', color: '#666666' }}>Across all 10 districts</p>
        </div>
        <div style={styles.statBox}>
          <div style={styles.iconWrapper}><WaterFlowIcon /></div>
          <div style={styles.statNumber}>2.8M m³</div>
          <p>Monthly Water Distributed</p>
          <p style={{ fontSize: '12px', color: '#666666' }}>Serving 500,000+ households</p>
        </div>
        <div style={styles.statBox}>
          <div style={styles.iconWrapper}><CheckIcon /></div>
          <div style={styles.statNumber}>89.5%</div>
          <p>Active Payments</p>
          <p style={{ fontSize: '12px', color: '#666666' }}>Collection rate this quarter</p>
        </div>
        <div style={styles.statBox}>
          <div style={styles.iconWrapper}><FactoryIcon /></div>
          <div style={styles.statNumber}>5</div>
          <p>Treatment Plants</p>
          <p style={{ fontSize: '12px', color: '#666666' }}>Across Lesotho</p>
        </div>
      </div>

      {/* Quick Bill Payment Widget */}
      <div style={styles.card}>
        <div style={styles.flexBetween}>
          <h3 style={styles.cardTitle}>QUICK BILL PAYMENT</h3>
          <span style={styles.badge}>SECURE</span>
        </div>
        <p>Pay your water bill instantly using your account number</p>
        <div style={styles.widgetContainer}>
          <input type="text" placeholder="Enter Account Number" style={styles.inputStyle} />
          <button style={styles.btnPrimary}>PAY NOW</button>
        </div>
      </div>

      {/* Service Coverage - Lesotho Districts */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>SERVICE COVERAGE - ALL 10 DISTRICTS OF LESOTHO</h3>
        <div style={styles.sectionTitleUnderline}></div>
        <div style={styles.fourColumnGrid}>
          <div style={styles.iconBox}>
            <div style={styles.iconWrapper}><LocationIcon /></div>
            <strong>Maseru</strong>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Capital District</p>
            <span style={{ color: '#000000', fontWeight: 'bold' }}>Full Coverage</span>
          </div>
          <div style={styles.iconBox}>
            <div style={styles.iconWrapper}><LocationIcon /></div>
            <strong>Leribe</strong>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Hlotse Area</p>
            <span style={{ color: '#000000', fontWeight: 'bold' }}>Full Coverage</span>
          </div>
          <div style={styles.iconBox}>
            <div style={styles.iconWrapper}><LocationIcon /></div>
            <strong>Berea</strong>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Teyateyaneng</p>
            <span style={{ color: '#000000', fontWeight: 'bold' }}>Full Coverage</span>
          </div>
          <div style={styles.iconBox}>
            <div style={styles.iconWrapper}><LocationIcon /></div>
            <strong>Mafeteng</strong>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Southern Region</p>
            <span style={{ color: '#000000', fontWeight: 'bold' }}>Full Coverage</span>
          </div>
          <div style={styles.iconBox}>
            <div style={styles.iconWrapper}><LocationIcon /></div>
            <strong>Mohale's Hoek</strong>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>South Central</p>
            <span style={{ color: '#000000', fontWeight: 'bold' }}>Full Coverage</span>
          </div>
          <div style={styles.iconBox}>
            <div style={styles.iconWrapper}><LocationIcon /></div>
            <strong>Quthing</strong>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Southernmost</p>
            <span style={{ color: '#666666' }}>Partial Coverage</span>
          </div>
          <div style={styles.iconBox}>
            <div style={styles.iconWrapper}><LocationIcon /></div>
            <strong>Qacha's Nek</strong>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Eastern Region</p>
            <span style={{ color: '#666666' }}>Partial Coverage</span>
          </div>
          <div style={styles.iconBox}>
            <div style={styles.iconWrapper}><LocationIcon /></div>
            <strong>Mokhotlong</strong>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Highlands</p>
            <span style={{ color: '#666666' }}>Developing</span>
          </div>
          <div style={styles.iconBox}>
            <div style={styles.iconWrapper}><LocationIcon /></div>
            <strong>Thaba-Tseka</strong>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Mountain Region</p>
            <span style={{ color: '#666666' }}>Developing</span>
          </div>
          <div style={styles.iconBox}>
            <div style={styles.iconWrapper}><LocationIcon /></div>
            <strong>Botha-Bothe</strong>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Northern Region</p>
            <span style={{ color: '#000000', fontWeight: 'bold' }}>Full Coverage</span>
          </div>
        </div>
      </div>

      {/* Water Infrastructure Section */}
      <div style={styles.threeColumnGrid}>
        <div style={styles.card}>
          <div style={styles.iconWrapper}><FactoryIcon /></div>
          <h3 style={{ ...styles.cardTitle, textAlign: 'center' }}>Maseru Water Treatment Plant</h3>
          <p style={{ textAlign: 'center' }}>Capacity: 80,000 m³/day</p>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#666666' }}>Serving Maseru and surrounding areas</p>
        </div>
        <div style={styles.card}>
          <div style={styles.iconWrapper}><DamIcon /></div>
          <h3 style={{ ...styles.cardTitle, textAlign: 'center' }}>Katse Dam</h3>
          <p style={{ textAlign: 'center' }}>Lesotho Highlands Water Project</p>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#666666' }}>Major water source for Lesotho and South Africa</p>
        </div>
        <div style={styles.card}>
          <div style={styles.iconWrapper}><SmartMeterIcon /></div>
          <h3 style={{ ...styles.cardTitle, textAlign: 'center' }}>Smart Meter Network</h3>
          <p style={{ textAlign: 'center' }}>50,000+ smart meters installed</p>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#666666' }}>Real-time monitoring across Lesotho</p>
        </div>
      </div>

      {/* Emergency Leakage Reporting */}
      <div style={styles.cardBlack}>
        <h3 style={styles.cardTitleWhite}>EMERGENCY WATER LEAKAGE REPORTING</h3>
        <p style={{ color: '#ffffff', marginBottom: '16px' }}>Report burst pipes, water leaks, or wastage immediately</p>
        <div style={styles.threeColumnGrid}>
          <button style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #ffffff', padding: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '4px 4px 0 rgba(255,255,255,0.1)' }}>CALL: 8000 1234</button>
          <button style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #ffffff', padding: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '4px 4px 0 rgba(255,255,255,0.1)' }}>WHATSAPP: +266 1234 5678</button>
          <button style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #ffffff', padding: '14px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '4px 4px 0 rgba(255,255,255,0.1)' }}>ONLINE REPORT FORM</button>
        </div>
      </div>

      {/* Water Usage Tips Preview */}
      <div style={styles.twoColumnGrid}>
        <div style={styles.card}>
          <div style={styles.iconWrapper}><LightbulbIcon /></div>
          <h3 style={styles.cardTitle}>WATER SAVING TIPS</h3>
          <ul style={{ marginLeft: '20px', marginTop: '12px', lineHeight: '1.8' }}>
            <li>Fix leaking taps immediately - saves 15L/day</li>
            <li>Take shorter showers - save 20L per day</li>
            <li>Turn off tap while brushing teeth</li>
            <li>Use a bucket instead of hose for car washing</li>
          </ul>
          <button style={styles.btnSecondary}>VIEW ALL TIPS</button>
        </div>
        <div style={styles.card}>
          <div style={styles.iconWrapper}><ChartIcon /></div>
          <h3 style={styles.cardTitle}>UNDERSTAND YOUR BILL</h3>
          <table style={styles.tableStyle}>
            <tbody>
              <tr>
                <td style={{ padding: '8px 0' }}>First 10 m³</td>
                <td style={{ padding: '8px 0' }}>M 5.00/m³</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>11 - 20 m³</td>
                <td style={{ padding: '8px 0' }}>M 7.50/m³</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>21 - 30 m³</td>
                <td style={{ padding: '8px 0' }}>M 10.00/m³</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0' }}>Above 30 m³</td>
                <td style={{ padding: '8px 0' }}>M 15.00/m³</td>
              </tr>
            </tbody>
          </table>
          <button style={styles.btnSecondary}>CALCULATE MY BILL</button>
        </div>
      </div>

      {/* Latest News Section */}
      <div style={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <NewsIcon />
          <h3 style={{ ...styles.cardTitle, marginBottom: 0 }}>LATEST NEWS AND UPDATES</h3>
        </div>
        <div style={styles.divider}></div>
        <div style={{ marginBottom: '16px' }}>
          <div style={styles.flexBetween}>
            <strong>Pipeline Upgrade Project</strong>
            <span style={{ fontSize: '12px', color: '#666666' }}>15 April 2026</span>
          </div>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>WASCO announces major pipeline upgrade in Maseru district to improve water supply reliability.</p>
        </div>
        <div style={styles.divider}></div>
        <div style={{ marginBottom: '16px' }}>
          <div style={styles.flexBetween}>
            <strong>New Customer Portal Launch</strong>
            <span style={{ fontSize: '12px', color: '#666666' }}>1 April 2026</span>
          </div>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>Access your water usage, pay bills, and report issues online through our new portal.</p>
        </div>
        <div style={styles.divider}></div>
        <div>
          <div style={styles.flexBetween}>
            <strong>Water Conservation Campaign</strong>
            <span style={{ fontSize: '12px', color: '#666666' }}>20 March 2026</span>
          </div>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>Join WASCO's water conservation campaign to save water and reduce your bill.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div style={styles.cardBlack}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={styles.cardTitleWhite}>NEED ASSISTANCE?</h3>
          <p style={{ color: '#ffffff', marginBottom: '20px' }}>Contact our customer service team for any inquiries</p>
          <div style={styles.contactButtonGroup}>
            <button style={styles.contactButton}>
              <PhoneIcon />
              CALL US
            </button>
            <button style={styles.contactButton}>
              <EmailIcon />
              EMAIL US
            </button>
            <button style={styles.contactButton}>
              <ChatIcon />
              LIVE CHAT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;