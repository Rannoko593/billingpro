import React, { useState } from 'react';

// SVG Icons - No emojis, all black and white - Consistent 20x20 size
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 3H9.5L11.5 8L9 10C10 13 13 16 16 16L18 13.5L23 15.5V18.5C23 20 21.5 22 20 22C10 22 2 14 2 4C2 2.5 4 1 5.5 1H8.5L10.5 6L8.5 8.5" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.5 2 2 6.5 2 12C2 13.5 2.5 15 3 16.5L2 22L7.5 21C9 21.5 10.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M16 14.5C15.5 15.5 14 16.5 12.5 16C11 15.5 8.5 13 8 11.5C7.5 10 8.5 9 9 8.5C9.5 8 10 8 10.5 8.5C11 9 11.5 10.5 11.5 11C11.5 11.5 11 11.5 10.5 12C10 12.5 10.5 13.5 11 14C11.5 14.5 12.5 15 13 14.5C13.5 14.5 13.5 14 14 13.5C14.5 13 15 13 15.5 13.5C16 14 16 14 16 14.5Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const EmergencyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 15,9 22,9 16,14 19,21 12,17 5,21 8,14 2,9 9,9 12,2" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M22 7L12 14L2 7" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="10" r="3" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 2C8 2 5 5 5 9C5 13 12 22 12 22C12 22 19 13 19 9C19 5 16 2 12 2Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 7V12L15 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V12M12 16H12.01" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2H15C13.5 2 12 3.5 12 5V8H9V12H12V22H16V12H19L20 8H16V5C16 4.5 16.5 4 17 4H18V2Z" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 3C22 3.5 20.5 4 19.5 4C18.5 3 16.5 2 14.5 2C11 2 8 4.5 8 8.5C8 9 8 9.5 8.5 10C5.5 9.5 3 7.5 1.5 5C1 5.5 0.5 6.5 0.5 7.5C0.5 10 2 12 4 13C3 13 2 13 1 12.5C1.5 15 3.5 16.5 6 17C5 17.5 3.5 18 2 17.5C3.5 19.5 6 20.5 8.5 20.5C5 23 1 23 0 22.5C2.5 24 6 24.5 9 24C15 23 19.5 18 19.5 11C19.5 10.5 19.5 10 19.5 9.5C20.5 8.5 21.5 7.5 23 6.5" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="4" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="#ffffff"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 8H8V20H4V8Z" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
    <path d="M8 11C9 9.5 10.5 8.5 12.5 8.5C15.5 8.5 17 10.5 17 13.5V20H13V14C13 12.5 12 12 11 12C10 12 9 12.5 9 14V20H5" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
    <circle cx="6" cy="6" r="2" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12C21 13.5 20.5 15 19.5 16C18.5 17 17 17.5 15.5 17.5H11L7 21V17.5C5 17 3.5 15.5 3 13.5C2.5 11.5 3 9 4.5 7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="11" r="1.5" fill="#ffffff"/>
    <circle cx="12" cy="11" r="1.5" fill="#ffffff"/>
    <circle cx="17" cy="11" r="1.5" fill="#ffffff"/>
  </svg>
);

const TrackingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 12C20 16.5 16.5 20 12 20M20 12L17 9M20 12L17 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 12C4 7.5 7.5 4 12 4M4 12L7 9M4 12L7 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M5 20V19C5 15.5 8 13 12 13C16 13 19 15.5 19 19V20" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', accountNumber: '', message: '', subject: '' });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTicketId = 'TKT' + Math.floor(Math.random() * 100000);
    setTicketId(newTicketId);
    setSubmitted(true);
    setFormData({ name: '', email: '', accountNumber: '', message: '', subject: '' });
    setTimeout(() => setSubmitted(false), 10000);
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    hero: {
      backgroundColor: '#000000',
      padding: '60px 40px',
      marginBottom: '40px',
      textAlign: 'center',
      border: '2px solid #ffffff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    heroTitle: {
      fontSize: '42px',
      marginBottom: '16px',
      fontWeight: '700',
      color: '#ffffff',
      letterSpacing: '-0.5px'
    },
    heroText: {
      fontSize: '16px',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6',
      color: '#cccccc'
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '30px',
      border: '2px solid #000000',
      marginBottom: '30px',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    cardBlack: {
      backgroundColor: '#000000',
      padding: '30px',
      border: '2px solid #ffffff',
      marginBottom: '30px',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    cardTitle: {
      fontSize: '24px',
      marginBottom: '24px',
      color: '#000000',
      fontWeight: '700'
    },
    cardTitleWhite: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#ffffff',
      fontWeight: '700'
    },
    sameLineHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px'
    },
    sameLineHeaderCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '20px'
    },
    twoColumnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '30px',
      marginBottom: '30px'
    },
    threeColumnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '30px',
      marginBottom: '30px'
    },
    contactInfo: {
      marginTop: '0px'
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px',
      padding: '14px 16px',
      backgroundColor: '#f8f8f8',
      border: '1px solid #dddddd',
      borderRadius: '0px'
    },
    contactItemNoBg: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '16px',
      padding: '8px 0px'
    },
    btnPrimary: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '14px 28px',
      cursor: 'pointer',
      width: '100%',
      fontWeight: '600',
      fontSize: '14px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    btnSecondary: {
      backgroundColor: '#ffffff',
      color: '#000000',
      border: '2px solid #000000',
      padding: '12px 24px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      fontSize: '14px',
      color: '#333333'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000000',
      fontSize: '14px',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000000',
      fontSize: '14px',
      minHeight: '100px',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff'
    },
    tableStyle: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    thStyle: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '14px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid #333333'
    },
    tdStyle: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '14px',
      color: '#333333'
    },
    alert: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '16px',
      marginBottom: '20px',
      border: '2px solid #155724'
    },
    divider: {
      height: '2px',
      backgroundColor: '#000000',
      margin: '20px 0'
    },
    socialLinks: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '16px'
    },
    socialButton: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '12px 24px',
      border: '2px solid #ffffff',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    emergencyBox: {
      backgroundColor: '#000000',
      padding: '30px',
      marginBottom: '30px',
      textAlign: 'center',
      border: '2px solid #ffffff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    emergencyNumber: {
      fontSize: '36px',
      fontWeight: '700',
      margin: '16px 0',
      color: '#ffffff'
    },
    centerText: {
      textAlign: 'center'
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '20px',
      flexWrap: 'wrap'
    },
    trackingInput: {
      padding: '12px',
      border: '2px solid #000000',
      fontSize: '14px',
      width: '300px',
      backgroundColor: '#ffffff'
    },
    phoneNumber: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#000000'
    },
    whitePhoneNumber: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#ffffff'
    },
    tableIconText: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    contactText: {
      fontSize: '14px',
      color: '#333333',
      lineHeight: '1.4'
    },
    contactTextStrong: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#000000'
    },
    addressLine: {
      fontSize: '14px',
      color: '#333333',
      lineHeight: '1.6',
      marginBottom: '4px'
    }
  };

  // District data with icons
  const districts = [
    { district: "Maseru", manager: "Mr. Thabo Molefi", phone: "+266 5122 1100", phoneIcon: "phone", email: "maseru@wasco.co.ls" },
    { district: "Leribe", manager: "Mrs. Mpho Letuka", phone: "+266 6122 1200", phoneIcon: "whatsapp", email: "leribe@wasco.co.ls" },
    { district: "Berea", manager: "Mr. Lebohang Ntai", phone: "+266 5122 1300", phoneIcon: "phone", email: "berea@wasco.co.ls" },
    { district: "Mafeteng", manager: "Mrs. Lineo Sejanamane", phone: "+266 6222 1400", phoneIcon: "emergency", email: "mafeteng@wasco.co.ls" },
    { district: "Mohale's Hoek", manager: "Mr. Motlatsi Phooko", phone: "+266 5122 1500", phoneIcon: "phone", email: "mohaleshoek@wasco.co.ls" },
    { district: "Quthing", manager: "Ms. Malitsepe Moiloa", phone: "+266 6122 1600", phoneIcon: "whatsapp", email: "quthing@wasco.co.ls" },
    { district: "Qacha's Nek", manager: "Mr. Tsepo Majara", phone: "+266 5122 1700", phoneIcon: "phone", email: "qachasnek@wasco.co.ls" },
    { district: "Mokhotlong", manager: "Mrs. Mampho Khobotlo", phone: "+266 6222 1800", phoneIcon: "emergency", email: "mokhotlong@wasco.co.ls" },
    { district: "Thaba-Tseka", manager: "Mr. Rethabile Mokhathi", phone: "+266 5122 1900", phoneIcon: "phone", email: "thabatseka@wasco.co.ls" },
    { district: "Botha-Bothe", manager: "Ms. Mathabo Liphoto", phone: "+266 6122 2000", phoneIcon: "whatsapp", email: "bothabothe@wasco.co.ls" }
  ];

  const renderPhoneIcon = (type) => {
    switch(type) {
      case 'whatsapp':
        return <WhatsAppIcon />;
      case 'emergency':
        return <EmergencyIcon />;
      default:
        return <PhoneIcon />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Contact WASCO</h1>
        <p style={styles.heroText}>We're here to help you 24/7. Reach out through any of our channels below.</p>
      </div>

      {/* Emergency Box */}
      <div style={styles.emergencyBox}>
        <div style={styles.sameLineHeaderCenter}>
          <AlertIcon />
          <h3 style={{ color: '#ffffff', margin: 0, fontSize: '24px' }}>Emergency Water Leakage Hotline</h3>
        </div>
        <div style={styles.emergencyNumber}>8000 1234</div>
        <p style={{ color: '#cccccc' }}>Available 24/7 for burst pipes and water emergencies</p>
      </div>

      {/* Two Column Layout */}
      <div style={styles.twoColumnGrid}>
        {/* Contact Form */}
        <div style={styles.card}>
          <div style={styles.sameLineHeader}>
            <SendIcon />
            <h2 style={styles.cardTitle}>Send us a Message</h2>
          </div>
          {submitted && (
            <div style={styles.alert}>
              <strong>Message Sent Successfully!</strong><br />
              Your ticket number: <strong>{ticketId}</strong><br />
              We'll respond within 24 hours.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input type="text" name="name" style={styles.input} value={formData.name} onChange={handleChange} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" name="email" style={styles.input} value={formData.email} onChange={handleChange} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>WASCO Account Number</label>
              <input type="text" name="accountNumber" style={styles.input} value={formData.accountNumber} onChange={handleChange} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Subject</label>
              <input type="text" name="subject" style={styles.input} value={formData.subject} onChange={handleChange} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Message</label>
              <textarea name="message" style={styles.textarea} value={formData.message} onChange={handleChange} required />
            </div>
            <button type="submit" style={styles.btnPrimary}>Send Message</button>
          </form>
        </div>

        {/* Contact Information Column */}
        <div>
          {/* Customer Service Hotlines */}
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <PhoneIcon />
              <h2 style={styles.cardTitle}>Customer Service Hotlines</h2>
            </div>
            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <PhoneIcon />
                <div><strong style={styles.contactTextStrong}>Toll-Free:</strong> <span style={styles.phoneNumber}>8000 1234</span></div>
              </div>
              <div style={styles.contactItem}>
                <WhatsAppIcon />
                <div><strong style={styles.contactTextStrong}>WhatsApp:</strong> <span style={styles.phoneNumber}>+266 5123 4567</span></div>
              </div>
              <div style={styles.contactItem}>
                <EmergencyIcon />
                <div><strong style={styles.contactTextStrong}>Emergency (24/7):</strong> <span style={styles.phoneNumber}>+266 6222 1000</span></div>
              </div>
              <div style={styles.contactItem}>
                <PhoneIcon />
                <div><strong style={styles.contactTextStrong}>Billing Inquiries:</strong> <span style={styles.phoneNumber}>+266 5122 1001</span></div>
              </div>
              <div style={styles.contactItem}>
                <PhoneIcon />
                <div><strong style={styles.contactTextStrong}>Technical Support:</strong> <span style={styles.phoneNumber}>+266 6122 1002</span></div>
              </div>
            </div>
          </div>

          {/* Head Office */}
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <LocationIcon />
              <h2 style={styles.cardTitle}>Head Office</h2>
            </div>
            <div style={styles.contactInfo}>
              <div style={styles.contactItemNoBg}>
                <LocationIcon />
                <div>
                  <div style={styles.addressLine}>WASCO House, Kingsway Road</div>
                  <div style={styles.addressLine}>Maseru 100, Lesotho</div>
                  <div style={styles.addressLine}>P.O. Box 426, Maseru</div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <ClockIcon />
              <h2 style={styles.cardTitle}>Business Hours</h2>
            </div>
            <div style={styles.contactInfo}>
              <div style={styles.contactItemNoBg}>
                <ClockIcon />
                <div>
                  <div style={styles.contactText}><strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM</div>
                  <div style={styles.contactText}><strong>Saturday:</strong> 9:00 AM - 1:00 PM</div>
                  <div style={styles.contactText}><strong>Sunday:</strong> Closed</div>
                  <div style={styles.contactText}><strong>Emergency:</strong> 24/7 Available</div>
                </div>
              </div>
              <div style={styles.divider}></div>
              <div style={styles.contactText}><strong>Holiday Schedule:</strong> Closed on public holidays</div>
            </div>
          </div>

          {/* Email Directory */}
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <EmailIcon />
              <h2 style={styles.cardTitle}>Email Directory</h2>
            </div>
            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <EmailIcon />
                <div><strong style={styles.contactTextStrong}>General Inquiries:</strong> info@wasco.co.ls</div>
              </div>
              <div style={styles.contactItem}>
                <EmailIcon />
                <div><strong style={styles.contactTextStrong}>Billing:</strong> billing@wasco.co.ls</div>
              </div>
              <div style={styles.contactItem}>
                <EmailIcon />
                <div><strong style={styles.contactTextStrong}>Complaints:</strong> complaints@wasco.co.ls</div>
              </div>
              <div style={styles.contactItem}>
                <EmailIcon />
                <div><strong style={styles.contactTextStrong}>Technical Support:</strong> support@wasco.co.ls</div>
              </div>
              <div style={styles.contactItem}>
                <EmailIcon />
                <div><strong style={styles.contactTextStrong}>CEO Office:</strong> ceo@wasco.co.ls</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District Offices Contact Directory */}
      <div style={styles.card}>
        <div style={styles.sameLineHeader}>
          <LocationIcon />
          <h2 style={styles.cardTitle}>Branch Manager Contact Directory - All Districts</h2>
        </div>
        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.thStyle}>District</th>
              <th style={styles.thStyle}>Branch Manager</th>
              <th style={styles.thStyle}>Phone</th>
              <th style={styles.thStyle}>Email</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((district, index) => (
              <tr key={index}>
                <td style={styles.tdStyle}>
                  <div style={styles.tableIconText}>
                    <LocationIcon />
                    <span>{district.district}</span>
                  </div>
                </td>
                <td style={styles.tdStyle}>
                  <div style={styles.tableIconText}>
                    <UserIcon />
                    <span>{district.manager}</span>
                  </div>
                </td>
                <td style={styles.tdStyle}>
                  <div style={styles.tableIconText}>
                    {renderPhoneIcon(district.phoneIcon)}
                    <span>{district.phone}</span>
                  </div>
                </td>
                <td style={styles.tdStyle}>
                  <div style={styles.tableIconText}>
                    <EmailIcon />
                    <span>{district.email}</span>
                  </div>
                </td>
               </tr>
            ))}
          </tbody>
         </table>
      </div>

      {/* Social Media Links */}
      <div style={styles.card}>
        <div style={styles.sameLineHeaderCenter}>
          <FacebookIcon />
          <h2 style={styles.cardTitle}>Follow WASCO on Social Media</h2>
        </div>
        <div style={styles.socialLinks}>
          <button style={styles.socialButton}><FacebookIcon /> Facebook</button>
          <button style={styles.socialButton}><TwitterIcon /> Twitter</button>
          <button style={styles.socialButton}><InstagramIcon /> Instagram</button>
          <button style={styles.socialButton}><LinkedInIcon /> LinkedIn</button>
          <button style={styles.socialButton}><WhatsAppIcon /> WhatsApp</button>
        </div>
      </div>

      {/* Live Chat Support */}
      <div style={styles.cardBlack}>
        <div style={styles.sameLineHeaderCenter}>
          <ChatIcon />
          <h2 style={styles.cardTitleWhite}>Live Chat Support</h2>
        </div>
        <p style={{ color: '#cccccc', textAlign: 'center', marginBottom: '20px' }}>Chat with our customer service representatives in real-time</p>
        <div style={styles.flexCenter}>
          <button style={styles.btnSecondary}>Start Live Chat</button>
        </div>
        <p style={{ marginTop: '16px', fontSize: '12px', color: '#999999', textAlign: 'center' }}>Available: Monday-Friday 8AM-5PM, Saturday 9AM-1PM</p>
      </div>

      {/* Track Your Ticket */}
      <div style={styles.card}>
        <div style={styles.sameLineHeaderCenter}>
          <TrackingIcon />
          <h2 style={styles.cardTitle}>Track Your Support Ticket</h2>
        </div>
        <div style={styles.flexCenter}>
          <input 
            type="text" 
            placeholder="Enter Ticket Number (e.g., TKT12345)" 
            style={styles.trackingInput} 
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <button style={styles.btnSecondary}>Track Ticket</button>
        </div>
      </div>

      {/* Quick Contact Options */}
      <div style={styles.cardBlack}>
        <div style={styles.sameLineHeaderCenter}>
          <PhoneIcon />
          <h2 style={styles.cardTitleWhite}>Quick Contact Options</h2>
        </div>
        <div style={styles.threeColumnGrid}>
          <div style={{ textAlign: 'center' }}>
            <PhoneIcon />
            <p><strong>Call Us</strong></p>
            <p style={styles.whitePhoneNumber}>8000 1234</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <WhatsAppIcon />
            <p><strong>WhatsApp</strong></p>
            <p style={styles.whitePhoneNumber}>+266 5123 4567</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <EmailIcon />
            <p><strong>Email Us</strong></p>
            <p style={styles.whitePhoneNumber}>info@wasco.co.ls</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;