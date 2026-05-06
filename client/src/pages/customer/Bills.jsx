import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [paypalError, setPaypalError] = useState('');

  const [payment, setPayment] = useState({
    paymentMethod: 'Mpesa',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchBills();
    fetchPayPalConfig();
  }, []);

  useEffect(() => {
    if (selectedBill && payment.paymentMethod === 'PayPal') {
      renderPayPalButton();
    }
  }, [selectedBill, payment.paymentMethod, paypalConfig]);

  const fetchBills = async () => {
    try {
      const res = await api.get('/bills/my-bills');
      setBills(res.data.bills || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load bills');
    }
  };

  const fetchPayPalConfig = async () => {
    try {
      const res = await api.get('/payments/paypal/config');
      setPaypalConfig(res.data);
    } catch (error) {
      setPaypalError(error.response?.data?.message || 'PayPal setup could not be loaded');
    }
  };

  const loadPayPalScript = () => {
    return new Promise((resolve, reject) => {
      if (!paypalConfig?.clientId) {
        reject(new Error('PayPal Client ID is missing'));
        return;
      }

      if (window.paypal) {
        resolve(window.paypal);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=${paypalConfig.currency || 'USD'}`;
      script.onload = () => resolve(window.paypal);
      script.onerror = () => reject(new Error('Failed to load PayPal payment button'));
      document.body.appendChild(script);
    });
  };

  const renderPayPalButton = async () => {
    const container = document.getElementById('paypal-button-container');
    if (!container || !selectedBill || payment.paymentMethod !== 'PayPal') return;

    container.innerHTML = '';
    setPaypalError('');

    try {
      const paypal = await loadPayPalScript();

      paypal.Buttons({
        createOrder: async () => {
          const res = await api.post('/payments/paypal/create-order', {
            billId: selectedBill.bill_id
          });
          return res.data.id;
        },
        onApprove: async (data) => {
          await api.post('/payments/paypal/capture-order', {
            billId: selectedBill.bill_id,
            orderID: data.orderID
          });

          alert('PayPal payment completed successfully');
          setSelectedBill(null);
          await fetchBills();
        },
        onError: (err) => {
          console.error(err);
          setPaypalError('PayPal payment failed. Please try again.');
        }
      }).render('#paypal-button-container');
    } catch (error) {
      setPaypalError(error.message || 'PayPal payment could not start');
    }
  };

  const openPaymentForm = (bill) => {
    setSelectedBill(bill);
    setPayment({
      paymentMethod: 'PayPal',
      paymentDate: new Date().toISOString().split('T')[0]
    });
  };

  const submitPayment = async (e) => {
    e.preventDefault();

    if (payment.paymentMethod === 'PayPal') {
      return;
    }

    try {
      await api.post('/payments/pay', {
        billId: selectedBill.bill_id,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate
      });

      alert('Payment completed successfully');

      setSelectedBill(null);
      await fetchBills();
    } catch (error) {
      alert(error.response?.data?.message || 'Payment failed');
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
    hero: {
      background: '#000',
      color: '#fff',
      padding: '40px',
      marginBottom: '30px',
      border: '2px solid #fff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    card: {
      background: '#fff',
      padding: '30px',
      border: '2px solid #000',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      marginBottom: '30px',
      overflowX: 'auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px'
    },
    label: {
      fontSize: '13px',
      fontWeight: '700',
      marginBottom: '6px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000',
      boxSizing: 'border-box',
      marginBottom: '15px',
      background: '#fff'
    },
    table: { width: '100%', borderCollapse: 'collapse', minWidth: '850px' },
    th: {
      background: '#000',
      color: '#fff',
      padding: '12px',
      textAlign: 'left',
      border: '1px solid #333'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      fontSize: '13px'
    },
    button: {
      background: '#000',
      color: '#fff',
      border: '2px solid #000',
      padding: '8px 14px',
      cursor: 'pointer',
      fontWeight: '700',
      boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
    },
    cancelBtn: {
      background: '#fff',
      color: '#000',
      border: '2px solid #000',
      padding: '8px 14px',
      cursor: 'pointer',
      fontWeight: '700',
      marginLeft: '8px'
    },
    paid: {
      fontWeight: '700',
      color: '#28a745'
    },
    pending: {
      fontWeight: '700',
      color: '#dc3545'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1>My Bills</h1>
        <p>View your water bills and make payments</p>
      </div>

      {selectedBill && (
        <div style={styles.card}>
          <h3>Payment Form</h3>

          <form onSubmit={submitPayment}>
            <div style={styles.grid}>
              <div>
                <div style={styles.label}>Bill ID</div>
                <input style={styles.input} value={selectedBill.bill_id} readOnly />
              </div>

              <div>
                <div style={styles.label}>Account Number</div>
                <input style={styles.input} value={selectedBill.account_number} readOnly />
              </div>

              <div>
                <div style={styles.label}>Amount</div>
                <input
                  style={styles.input}
                  value={`M ${Number(selectedBill.total_amount_due || 0).toFixed(2)}`}
                  readOnly
                />
              </div>

              <div>
                <div style={styles.label}>Payment Method</div>
                <select
                  style={styles.input}
                  value={payment.paymentMethod}
                  onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value })}
                >
                  <option value="PayPal">PayPal</option>
                  <option value="Mpesa">Mpesa</option>
                  <option value="Ecocash">Ecocash</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              <div>
                <div style={styles.label}>Date</div>
                <input
                  style={styles.input}
                  type="date"
                  value={payment.paymentDate}
                  onChange={(e) => setPayment({ ...payment, paymentDate: e.target.value })}
                />
              </div>
            </div>

            {payment.paymentMethod === 'PayPal' ? (
              <div>
                <p style={{ fontSize: '13px', fontWeight: '700' }}>
                  PayPal will open in sandbox mode. The app marks the bill paid only after PayPal confirms capture.
                </p>
                {paypalError && <p style={{ color: '#dc3545', fontWeight: '700' }}>{paypalError}</p>}
                <div id="paypal-button-container"></div>
              </div>
            ) : (
              <button style={styles.button} type="submit">
                Confirm Payment
              </button>
            )}

            <button
              style={styles.cancelBtn}
              type="button"
              onClick={() => setSelectedBill(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Bill ID</th>
              <th style={styles.th}>Account Number</th>
              <th style={styles.th}>Month</th>
              <th style={styles.th}>Year</th>
              <th style={styles.th}>Usage</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {bills.length > 0 ? (
              bills.map((bill) => (
                <tr key={bill.bill_id}>
                  <td style={styles.td}>#{bill.bill_id}</td>
                  <td style={styles.td}>{bill.account_number}</td>
                  <td style={styles.td}>{bill.month}</td>
                  <td style={styles.td}>{bill.year}</td>
                  <td style={styles.td}>{bill.consumption} m³</td>
                  <td style={styles.td}>M {Number(bill.total_amount_due || 0).toFixed(2)}</td>
                  <td style={styles.td}>{bill.due_date || 'N/A'}</td>
                  <td style={styles.td}>
                    <span style={bill.payment_status === 'paid' ? styles.paid : styles.pending}>
                      {bill.payment_status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {bill.payment_status === 'paid' ? (
                      <strong>Paid</strong>
                    ) : (
                      <button style={styles.button} onClick={() => openPaymentForm(bill)}>
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="9">
                  No bills available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bills;