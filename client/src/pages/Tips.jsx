import React, { useState } from 'react';

// SVG Icons - All Black Color
const LightbulbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.5 18.5H14.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 21H14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 15V18" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 3C8.5 3 5.5 5.5 5.5 9.5C5.5 12 7 14 8.5 15.5C9 16 9.5 16.5 9.5 17.5H14.5C14.5 16.5 15 16 15.5 15.5C17 14 18.5 12 18.5 9.5C18.5 5.5 15.5 3 12 3Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const IndoorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M8 10H16M8 14H13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const OutdoorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 4V2M12 22V20M20 12H22M2 12H4" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const KitchenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="18" height="14" rx="2" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M7 10H17M7 14H14" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="17" r="1.5" fill="#000000"/>
    <circle cx="12" cy="17" r="1.5" fill="#000000"/>
  </svg>
);

const BathroomIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 2 8 6 8 10C8 12.5 10 14 12 14C14 14 16 12.5 16 10C16 6 12 2 12 2Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M5 20H19" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="4" y="16" width="16" height="4" rx="1" stroke="#000000" strokeWidth="1.5" fill="none"/>
  </svg>
);

const CalculatorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M8 7H16M8 11H16M8 15H10M12 15H16" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const GuideIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6C4 4.5 5 4 6 4H18C19 4 20 4.5 20 6V18C20 19.5 19 20 18 20H6C5 20 4 19.5 4 18V6Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M8 8H16M8 12H14M8 16H12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 8V16M9 10H15M9 14H15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C9 5 5 8 5 13C5 17 8 20 12 22C16 20 19 17 19 13C19 8 15 5 12 2Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 2V12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const WaterDropIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5C12 2.5 7 9.5 7 14C7 16.5 9 18.5 12 18.5C15 18.5 17 16.5 17 14C17 9.5 12 2.5 12 2.5Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 15.5C13.5 15.5 14.5 14.5 14.5 13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3V15M12 15L15 12M12 15L9 12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 17V19C5 20.5 6 21 7 21H17C18 21 19 20.5 19 19V17" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Tips = () => {
  const [activeTab, setActiveTab] = useState('indoor');
  const [calculatorValue, setCalculatorValue] = useState('');
  const [savings, setSavings] = useState(null);
  const [tipOfDay, setTipOfDay] = useState('Fix leaking taps immediately - one drip per second wastes 15 liters per day!');
  const [userTip, setUserTip] = useState('');
  const [submittedTips, setSubmittedTips] = useState([]);

  const calculateSavings = () => {
    const usage = parseFloat(calculatorValue);
    if (!isNaN(usage)) {
      const potentialSavings = usage * 0.35;
      setSavings(potentialSavings);
    }
  };

  const submitUserTip = () => {
    if (userTip.trim()) {
      setSubmittedTips([...submittedTips, { tip: userTip, date: new Date().toLocaleDateString() }]);
      setUserTip('');
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
      letterSpacing: '-0.5px'
    },
    heroText: {
      fontSize: '16px',
      opacity: '0.9',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6',
      color: '#cccccc'
    },
    card: {
      background: '#ffffff',
      padding: '30px',
      border: '2px solid #000000',
      marginBottom: '30px',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    cardBlack: {
      background: '#000000',
      padding: '30px',
      border: '2px solid #ffffff',
      marginBottom: '30px',
      color: '#ffffff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    cardTitle: {
      fontSize: '22px',
      marginBottom: 0,
      color: '#000000',
      fontWeight: '700'
    },
    cardTitleWhite: {
      fontSize: '22px',
      marginBottom: 0,
      color: '#ffffff',
      fontWeight: '700'
    },
    sameLineHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px'
    },
    sameLineHeaderCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '20px'
    },
    tabContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
      cursor: 'pointer',
      color: '#000000',
      fontWeight: '600',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.05)'
    },
    activeTab: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#000000',
      border: '2px solid #000000',
      cursor: 'pointer',
      color: '#ffffff',
      fontWeight: '600',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '30px',
      marginBottom: '30px'
    },
    threeColumnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '30px',
      marginBottom: '30px'
    },
    fourColumnGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '24px'
    },
    listStyle: {
      marginTop: '10px',
      marginLeft: '20px',
      lineHeight: '1.8',
      color: '#333333'
    },
    listStyleWhite: {
      marginTop: '10px',
      marginLeft: '20px',
      lineHeight: '1.8',
      color: '#cccccc'
    },
    calculatorBox: {
      backgroundColor: '#f5f5f5',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid #dddddd'
    },
    inputStyle: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000000',
      margin: '10px 0',
      fontSize: '14px',
      background: '#ffffff'
    },
    btnPrimary: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '12px 24px',
      cursor: 'pointer',
      fontWeight: '600',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    btnSecondary: {
      backgroundColor: '#ffffff',
      color: '#000000',
      border: '2px solid #000000',
      padding: '12px 24px',
      cursor: 'pointer',
      fontWeight: '600',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    savingsText: {
      marginTop: '15px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#28a745'
    },
    tipOfDayBox: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '30px',
      textAlign: 'center',
      marginBottom: '30px',
      border: '2px solid #ffffff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    tipOfDayText: {
      fontSize: '20px',
      marginTop: '15px',
      marginBottom: '20px',
      lineHeight: '1.5'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginTop: '10px',
      flexWrap: 'wrap'
    },
    tableStyle: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    thStyle: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '12px',
      textAlign: 'left',
      border: '1px solid #333333'
    },
    tdStyle: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0'
    },
    seasonalBox: {
      backgroundColor: '#f8f8f8',
      padding: '20px',
      border: '2px solid #000000',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.05)'
    },
    fullWidthCard: {
      background: '#ffffff',
      padding: '30px',
      border: '2px solid #000000',
      marginBottom: '30px',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      textAlign: 'center'
    },
    leakDetectionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    leakCard: {
      backgroundColor: '#1a1a1a',
      padding: '20px',
      border: '1px solid #333333',
      textAlign: 'left'
    },
    leakTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#ffffff'
    },
    buttonWithIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Water Conservation Tips</h1>
        <p style={styles.heroText}>Simple ways to save water, reduce your bill, and protect our environment in Lesotho</p>
      </div>

      {/* Tip of the Day */}
      <div style={styles.tipOfDayBox}>
        <div style={styles.sameLineHeaderCenter}>
          <LightbulbIcon />
          <h3 style={{ color: '#ffffff', margin: 0, fontSize: '24px' }}>Tip of the Day</h3>
        </div>
        <p style={styles.tipOfDayText}>{tipOfDay}</p>
        <div style={styles.buttonContainer}>
          <button style={styles.btnPrimary} onClick={() => {
            const tips = [
              'Take shorter showers - reduce by 2 minutes to save 20L per day',
              'Turn off tap while brushing teeth - saves 8L per minute',
              'Use a bucket instead of hose to wash your car - saves 150L',
              'Water your garden early morning or evening to reduce evaporation',
              'Fix leaking toilets immediately - can waste 200L per day',
              'Install a rainwater harvesting system - save thousands of liters',
              'Use a broom instead of a hose to clean driveways',
              'Only run dishwasher and washing machine when full'
            ];
            setTipOfDay(tips[Math.floor(Math.random() * tips.length)]);
          }}>Get New Tip</button>
          <button style={styles.btnSecondary}>Save This Tip</button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        <button style={activeTab === 'indoor' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('indoor')}>
          <IndoorIcon /> Indoor Tips
        </button>
        <button style={activeTab === 'outdoor' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('outdoor')}>
          <OutdoorIcon /> Outdoor Tips
        </button>
        <button style={activeTab === 'kitchen' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('kitchen')}>
          <KitchenIcon /> Kitchen Tips
        </button>
        <button style={activeTab === 'bathroom' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('bathroom')}>
          <BathroomIcon /> Bathroom Tips
        </button>
        <button style={activeTab === 'calculator' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('calculator')}>
          <CalculatorIcon /> Calculator
        </button>
        <button style={activeTab === 'guide' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('guide')}>
          <GuideIcon /> Meter Guide
        </button>
      </div>

      {/* Indoor Tips */}
      {activeTab === 'indoor' && (
        <div style={styles.gridContainer}>
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <LightbulbIcon />
              <h3 style={styles.cardTitle}>Quick Indoor Savings</h3>
            </div>
            <ul style={styles.listStyle}>
              <li>Fix leaky faucets immediately - a drip per second wastes 15L/day</li>
              <li>Turn off water while brushing teeth (saves 8L per minute)</li>
              <li>Take shorter showers - reduce by 2 minutes saves 20L</li>
              <li>Install water-efficient showerheads and faucets</li>
              <li>Use a bucket instead of running hose for cleaning</li>
              <li>Check toilets for silent leaks using food coloring</li>
            </ul>
          </div>
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <MoneyIcon />
              <h3 style={styles.cardTitle}>Money Saving Facts</h3>
            </div>
            <ul style={styles.listStyle}>
              <li>Fixing a leak saves M 500-1000 per year</li>
              <li>Low-flow showerhead saves M 300 annually</li>
              <li>Full dishwasher uses 50% less water than hand washing</li>
              <li>Average household can save M 1,500 yearly with conservation</li>
            </ul>
          </div>
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <WaterDropIcon />
              <h3 style={styles.cardTitle}>Lesotho Water Facts</h3>
            </div>
            <ul style={styles.listStyle}>
              <li>Average household uses 15-20 m³ per month</li>
              <li>Water rates increased by 8% in 2024</li>
              <li>Maseru district uses 40% of total water supply</li>
              <li>Winter months see 20% less water consumption</li>
            </ul>
          </div>
        </div>
      )}

      {/* Outdoor Tips */}
      {activeTab === 'outdoor' && (
        <div style={styles.gridContainer}>
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <LeafIcon />
              <h3 style={styles.cardTitle}>Garden and Lawn</h3>
            </div>
            <ul style={styles.listStyle}>
              <li>Water plants early morning or evening (reduces evaporation by 30%)</li>
              <li>Use mulch around plants to retain moisture</li>
              <li>Collect rainwater in barrels for gardening</li>
              <li>Choose drought-resistant native plants</li>
              <li>Use a broom, not hose, to clean driveways</li>
              <li>Adjust sprinklers to water lawn, not pavement</li>
            </ul>
          </div>
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <WaterDropIcon />
              <h3 style={styles.cardTitle}>Rainwater Harvesting</h3>
            </div>
            <p>Collecting rainwater can save thousands of liters annually:</p>
            <ul style={styles.listStyle}>
              <li>One rain barrel saves 1,000L per year</li>
              <li>Install a rain tank for larger savings</li>
              <li>Use collected water for gardens and cleaning</li>
              <li>Lesotho receives 700-800mm rainfall annually</li>
            </ul>
          </div>
        </div>
      )}

      {/* Kitchen Tips */}
      {activeTab === 'kitchen' && (
        <div style={styles.gridContainer}>
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <KitchenIcon />
              <h3 style={styles.cardTitle}>Kitchen Water Saving</h3>
            </div>
            <ul style={styles.listStyle}>
              <li>Run dishwasher only when full (saves 40L per cycle)</li>
              <li>Scrape dishes instead of pre-rinsing</li>
              <li>Wash vegetables in a bowl of water, not running tap</li>
              <li>Keep drinking water in refrigerator</li>
              <li>Soak pots and pans before washing</li>
            </ul>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Dishwashing Comparison</h3>
            <table style={styles.tableStyle}>
              <thead>
                <tr><th style={styles.thStyle}>Method</th><th style={styles.thStyle}>Water Used</th><th style={styles.thStyle}>Savings</th></tr>
              </thead>
              <tbody>
                <tr><td style={styles.tdStyle}>Hand washing (running tap)</td><td style={styles.tdStyle}>40-60L</td><td style={styles.tdStyle}>-</td></tr>
                <tr><td style={styles.tdStyle}>Hand washing (filled sink)</td><td style={styles.tdStyle}>20-30L</td><td style={styles.tdStyle}>50%</td></tr>
                <tr><td style={styles.tdStyle}>Full dishwasher</td><td style={styles.tdStyle}>15-20L</td><td style={styles.tdStyle}>65%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bathroom Tips */}
      {activeTab === 'bathroom' && (
        <div style={styles.gridContainer}>
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <BathroomIcon />
              <h3 style={styles.cardTitle}>Toilet Savings</h3>
            </div>
            <ul style={styles.listStyle}>
              <li>Don't use toilet as trash can (flush only when necessary)</li>
              <li>Install a dual-flush toilet (saves 30L per day)</li>
              <li>Place a filled bottle in tank to reduce flush volume</li>
              <li>Check for silent leaks - fix immediately</li>
            </ul>
          </div>
          <div style={styles.card}>
            <div style={styles.sameLineHeader}>
              <WaterDropIcon />
              <h3 style={styles.cardTitle}>Shower Savings</h3>
            </div>
            <ul style={styles.listStyle}>
              <li>Limit showers to 5 minutes (use a timer)</li>
              <li>Turn off water while soaping up</li>
              <li>Install low-flow showerhead (saves 15L per minute)</li>
              <li>Catch water while waiting for hot water</li>
            </ul>
          </div>
        </div>
      )}

      {/* Interactive Water Calculator */}
      {activeTab === 'calculator' && (
        <div style={styles.card}>
          <div style={styles.sameLineHeader}>
            <CalculatorIcon />
            <h3 style={styles.cardTitle}>Interactive Water Savings Calculator</h3>
          </div>
          <div style={styles.calculatorBox}>
            <p>Enter your monthly water usage (m³):</p>
            <input type="number" style={styles.inputStyle} placeholder="e.g., 20" value={calculatorValue} onChange={(e) => setCalculatorValue(e.target.value)} />
            <button style={styles.btnPrimary} onClick={calculateSavings}>Calculate Potential Savings</button>
            {savings !== null && (
              <div style={styles.savingsText}>
                <p>With water conservation measures, you could save:</p>
                <p style={{ fontSize: '24px' }}>{savings.toFixed(1)} m³ per month</p>
                <p>≈ M {(savings * 7.5).toFixed(2)} off your monthly bill!</p>
                <p style={{ fontSize: '12px' }}>That's M {(savings * 7.5 * 12).toFixed(2)} per year!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* How to Read Your Water Meter Guide */}
      {activeTab === 'guide' && (
        <div style={styles.card}>
          <div style={styles.sameLineHeader}>
            <GuideIcon />
            <h3 style={styles.cardTitle}>How to Read Your Water Meter</h3>
          </div>
          <div style={styles.fourColumnGrid}>
            <div style={{ padding: '10px' }}>
              <h4>Step 1: Locate Your Meter</h4>
              <p>Your water meter is usually found outside near the street.</p>
            </div>
            <div style={{ padding: '10px' }}>
              <h4>Step 2: Read the Numbers</h4>
              <p>Read from left to right. Black numbers represent cubic meters.</p>
            </div>
            <div style={{ padding: '10px' }}>
              <h4>Step 3: Track Usage</h4>
              <p>Subtract last month's reading from current reading.</p>
            </div>
            <div style={{ padding: '10px' }}>
              <h4>Step 4: Check for Leaks</h4>
              <p>Turn off all water - if meter moves, you have a leak!</p>
            </div>
          </div>
        </div>
      )}

      {/* Understanding Your Water Bill */}
      <div style={styles.card}>
        <div style={styles.sameLineHeader}>
          <MoneyIcon />
          <h3 style={styles.cardTitle}>Understanding Your Water Bill</h3>
        </div>
        <table style={styles.tableStyle}>
          <thead>
            <tr><th style={styles.thStyle}>Charge Type</th><th style={styles.thStyle}>Description</th><th style={styles.thStyle}>Rate</th></tr>
          </thead>
          <tbody>
            <tr><td style={styles.tdStyle}>First 10 m³</td><td style={styles.tdStyle}>Basic water usage</td><td style={styles.tdStyle}>M 5.00/m³</td></tr>
            <tr><td style={styles.tdStyle}>11 - 20 m³</td><td style={styles.tdStyle}>Medium usage</td><td style={styles.tdStyle}>M 7.50/m³</td></tr>
            <tr><td style={styles.tdStyle}>21 - 30 m³</td><td style={styles.tdStyle}>High usage</td><td style={styles.tdStyle}>M 10.00/m³</td></tr>
            <tr><td style={styles.tdStyle}>Above 30 m³</td><td style={styles.tdStyle}>Excessive usage</td><td style={styles.tdStyle}>M 15.00/m³</td></tr>
            <tr><td style={styles.tdStyle}>Sewerage Fee</td><td style={styles.tdStyle}>Monthly service charge</td><td style={styles.tdStyle}>M 50.00</td></tr>
          </tbody>
        </table>
      </div>

      {/* Seasonal Water Saving Guides */}
      <div style={styles.card}>
        <div style={styles.sameLineHeader}>
          <LeafIcon />
          <h3 style={styles.cardTitle}>Seasonal Water Saving Guides for Lesotho</h3>
        </div>
        <div style={styles.threeColumnGrid}>
          <div style={styles.seasonalBox}>
            <h4>Summer (Nov-Feb)</h4>
            <ul style={styles.listStyle}>
              <li>Water garden early morning or evening</li>
              <li>Use pool covers to reduce evaporation</li>
              <li>Collect rainwater for gardening</li>
            </ul>
          </div>
          <div style={styles.seasonalBox}>
            <h4>Winter (May-Aug)</h4>
            <ul style={styles.listStyle}>
              <li>Protect pipes from freezing</li>
              <li>Fix leaks before winter</li>
              <li>Use less outdoor water</li>
            </ul>
          </div>
          <div style={styles.seasonalBox}>
            <h4>Spring (Sep-Oct)</h4>
            <ul style={styles.listStyle}>
              <li>Check irrigation systems</li>
              <li>Clean gutters and downspouts</li>
              <li>Start rainwater harvesting</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Leak Detection and Prevention */}
      <div style={styles.cardBlack}>
        <div style={styles.sameLineHeaderCenter}>
          <WaterDropIcon />
          <h3 style={styles.cardTitleWhite}>Leak Detection and Prevention</h3>
        </div>
        <p style={{ color: '#cccccc', textAlign: 'center', maxWidth: '800px', margin: '0 auto 20px auto' }}>
          Early detection of water leaks can save thousands of liters and reduce your monthly bill significantly
        </p>
        <div style={styles.leakDetectionGrid}>
          <div style={styles.leakCard}>
            <h4 style={styles.leakTitle}>Check Your Meter</h4>
            <p style={{ color: '#cccccc', fontSize: '14px' }}>Turn off all water and watch the meter for 30 minutes. If it moves, you have a leak.</p>
          </div>
          <div style={styles.leakCard}>
            <h4 style={styles.leakTitle}>Listen for Running Water</h4>
            <p style={{ color: '#cccccc', fontSize: '14px' }}>Even when all taps are off, listen carefully for any sound of running water.</p>
          </div>
          <div style={styles.leakCard}>
            <h4 style={styles.leakTitle}>Check Toilets</h4>
            <p style={{ color: '#cccccc', fontSize: '14px' }}>Add food coloring to tank - if color appears in bowl without flushing, you have a leak.</p>
          </div>
          <div style={styles.leakCard}>
            <h4 style={styles.leakTitle}>Monitor Your Bill</h4>
            <p style={{ color: '#cccccc', fontSize: '14px' }}>Sudden increases in your water bill often indicate hidden leaks.</p>
          </div>
          <div style={styles.leakCard}>
            <h4 style={styles.leakTitle}>Inspect Outdoor Taps</h4>
            <p style={{ color: '#cccccc', fontSize: '14px' }}>Regularly check outside faucets for drips after use.</p>
          </div>
          <div style={styles.leakCard}>
            <h4 style={styles.leakTitle}>Check Water Pressure</h4>
            <p style={{ color: '#cccccc', fontSize: '14px' }}>High water pressure can indicate pipe issues. Normal range is 40-60 PSI.</p>
          </div>
        </div>
      </div>

      {/* Printable Conservation Guide - with Download Icon on Button */}
      <div style={styles.fullWidthCard}>
        <div style={styles.sameLineHeaderCenter}>
          <DownloadIcon />
          <h3 style={{ ...styles.cardTitle, marginBottom: 0 }}>Printable Conservation Guide</h3>
        </div>
        <p style={{ marginBottom: '20px', color: '#555555' }}>Download our complete water conservation guide for your home</p>
        <button style={styles.btnPrimary}>
          <div style={styles.buttonWithIcon}>
            <DownloadIcon />
            Download PDF Guide (2.5 MB)
          </div>
        </button>
      </div>

      {/* User-Submitted Tips Section */}
      <div style={styles.card}>
        <div style={styles.sameLineHeader}>
          <LightbulbIcon />
          <h3 style={styles.cardTitle}>Share Your Water Saving Tip</h3>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="text" style={styles.inputStyle} placeholder="Share your water saving tip..." value={userTip} onChange={(e) => setUserTip(e.target.value)} />
          <button style={styles.btnPrimary} onClick={submitUserTip}>Submit Tip</button>
        </div>
        {submittedTips.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>Community Tips ({submittedTips.length})</h4>
            <ul style={styles.listStyle}>
              {submittedTips.slice(-5).reverse().map((tip, idx) => (
                <li key={idx}><strong>{tip.date}:</strong> {tip.tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tips;