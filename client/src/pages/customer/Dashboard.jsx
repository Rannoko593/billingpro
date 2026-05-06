import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

// SVG Icons - No emojis
const WelcomeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
    <path d="M5 20V19C5 15 8 13 12 13C16 13 19 15 19 19V20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="8" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 8V16M9 10H15M9 14H15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const WaterDropIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5C12 2.5 7 9.5 7 14C7 16.5 9 18.5 12 18.5C15 18.5 17 16.5 17 14C17 9.5 12 2.5 12 2.5Z" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M12 15.5C13.5 15.5 14.5 14.5 14.5 13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#000000" strokeWidth="1.5" fill="none"/>
    <path d="M8 2V6M16 2V6" stroke="#000000" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 10H21" stroke="#000000" strokeWidth="1.5"/>
  </svg>
);

const PaymentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
    <path d="M2 9H22" stroke="#ffffff" strokeWidth="1.5"/>
  </svg>
);

const BillIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 5C4 3.5 5 3 6 3H18C19 3 20 3.5 20 5V19C20 20.5 19 21 18 21H6C5 21 4 20.5 4 19V5Z" stroke="#333333" strokeWidth="1.5" fill="none"/>
    <path d="M8 7H16M8 11H14M8 15H12" stroke="#333333" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CalendarSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#666666" strokeWidth="1.5" fill="none"/>
    <path d="M8 2V6M16 2V6" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 10H21" stroke="#666666" strokeWidth="1.5"/>
  </svg>
);

const StatusPendingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#dc3545" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="4" stroke="#dc3545" strokeWidth="1.5" fill="none"/>
  </svg>
);

const StatusPaidIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#28a745" strokeWidth="1.5" fill="none"/>
    <path d="M8 12L11 15L16 9" stroke="#28a745" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bills, setBills] = useState([]);
  const [usageSummary, setUsageSummary] = useState({});
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const billsRes = await api.get('/bills/my-bills');
      const usageRes = await api.get('/usage/my-usage');
      const paymentsRes = await api.get('/payments/history');

      setBills(billsRes.data.bills || []);
      setUsageSummary(usageRes.data.usage || {});
      setPayments(paymentsRes.data.payments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBillStatus = (bill) => bill.payment_status || bill.status || 'pending';
  const getBillAmount = (bill) => Number(bill.total_amount_due ?? bill.amount ?? 0);

  const outstandingBalance = bills
    .filter((b) => getBillStatus(b) !== 'paid')
    .reduce((sum, b) => sum + getBillAmount(b), 0);

  const latestUsage = usageSummary.latest || null;
  const currentMonthUsage = latestUsage?.consumption || 0;
  const estimatedBill = bills.length > 0 ? getBillAmount(bills[0]) : 0;

  const lastPayment = payments[0] || null;
  const recentBills = bills.slice(0, 5);

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
    hero: { backgroundColor: '#000000', color: '#ffffff', padding: '40px', marginBottom: '30px', border: '2px solid #ffffff', boxShadow: '8px 8px 0 rgba(255,255,255,0.1)' },
    heroTitle: { fontSize: '28px', marginBottom: '8px', fontWeight: '700', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' },
    heroText: { fontSize: '14px', color: '#cccccc', display: 'flex', alignItems: 'center', gap: '8px' },
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '30px' },
    card: { background: '#ffffff', padding: '28px', border: '2px solid #000000', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)' },
    cardTitle: { fontSize: '18px', marginBottom: '16px', color: '#000000', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' },
    statNumber: { fontSize: '36px', fontWeight: '700', color: '#000000', margin: '16px 0' },
    btnPrimary: { backgroundColor: '#000000', color: '#ffffff', border: '2px solid #000000', padding: '10px 20px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '4px 4px 0 rgba(0,0,0,0.1)' },
    tableCard: { background: '#ffffff', padding: '28px', border: '2px solid #000000', marginBottom: '30px', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)', overflowX: 'auto' },
    tableStyle: { width: '100%', borderCollapse: 'collapse', minWidth: '500px' },
    thStyle: { backgroundColor: '#000000', color: '#ffffff', padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', border: '1px solid #333333' },
    tdStyle: { padding: '12px', borderBottom: '1px solid #e0e0e0', fontSize: '13px', color: '#333333' },
    statusPending: { display: 'flex', alignItems: 'center', gap: '6px', color: '#dc3545', fontWeight: '600' },
    statusPaid: { display: 'flex', alignItems: 'center', gap: '6px', color: '#28a745', fontWeight: '600' },
    tableHeaderContent: { display: 'flex', alignItems: 'center', gap: '8px' },
    estimatedText: { marginTop: '12px', fontSize: '13px', color: '#666666', display: 'flex', alignItems: 'center', gap: '6px' }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px', border: '2px solid #000000', backgroundColor: '#ffffff', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)' }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          <WelcomeIcon />
          Welcome back, {user?.name}!
        </h1>
        <p style={styles.heroText}>
          <BillIcon />
          Account Number: {user?.accountNumber}
        </p>
      </div>

      <div style={styles.gridContainer}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <MoneyIcon />
            Outstanding Balance
          </div>
          <div style={styles.statNumber}>M {outstandingBalance.toFixed(2)}</div>
          <button style={styles.btnPrimary} onClick={() => navigate('/customer/bills')}>
            <PaymentIcon /> Pay Now
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <WaterDropIcon />
            Current Month Usage
          </div>
          <div style={styles.statNumber}>{Number(currentMonthUsage || 0).toFixed(2)} m³</div>
          <div style={styles.estimatedText}>
            <MoneyIcon />
            Estimated Bill: M {Number(estimatedBill || 0).toFixed(2)}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <CalendarIcon />
            Last Payment
          </div>
          <div style={styles.statNumber}>M {Number(lastPayment?.amountPaid || 0).toFixed(2)}</div>
          <div style={styles.estimatedText}>
            <CalendarSmallIcon />
            Date: {lastPayment?.paymentDate ? new Date(lastPayment.paymentDate).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>

      <div style={styles.tableCard}>
        <h3 style={styles.cardTitle}>
          <BillIcon />
          Recent Bills
        </h3>

        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.thStyle}>
                <div style={styles.tableHeaderContent}>
                  <CalendarSmallIcon />
                  Month
                </div>
              </th>

              <th style={styles.thStyle}>
                <div style={styles.tableHeaderContent}>
                  <MoneyIcon />
                  Amount
                </div>
              </th>

              <th style={styles.thStyle}>
                <div style={styles.tableHeaderContent}>
                  <CalendarSmallIcon />
                  Due Date
                </div>
              </th>

              <th style={styles.thStyle}>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentBills.length > 0 ? (
              recentBills.map((bill) => {
                const status = getBillStatus(bill);

                return (
                  <tr key={bill.bill_id || bill.id}>
                    <td style={styles.tdStyle}>{bill.month} {bill.year}</td>
                    <td style={styles.tdStyle}>M {getBillAmount(bill).toFixed(2)}</td>
                    <td style={styles.tdStyle}>
                      {bill.due_date ? new Date(bill.due_date).toLocaleDateString() : bill.dueDate || 'N/A'}
                    </td>
                    <td style={styles.tdStyle}>
                      {status === 'paid' ? (
                        <div style={styles.statusPaid}>
                          <StatusPaidIcon />
                          PAID
                        </div>
                      ) : (
                        <div style={styles.statusPending}>
                          <StatusPendingIcon />
                          NOT PAID
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td style={styles.tdStyle} colSpan="4">
                  No bills generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;