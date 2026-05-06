import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/history');
      setPayments(response.data.payments || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (paymentId) => {
    try {
      const response = await api.get(`/payments/receipt/${paymentId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', `receipt-${paymentId}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Failed to download receipt');
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' },
    hero: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '40px',
      marginBottom: '30px',
      border: '2px solid #ffffff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    title: { fontSize: '28px', marginBottom: '8px', fontWeight: '700' },
    text: { fontSize: '14px', color: '#cccccc' },
    card: {
      background: '#ffffff',
      padding: '30px',
      border: '2px solid #000000',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
      overflowX: 'auto'
    },
    table: { width: '100%', borderCollapse: 'collapse', minWidth: '850px' },
    th: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '14px',
      textAlign: 'left',
      fontSize: '13px',
      border: '1px solid #333333'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '13px',
      color: '#333333'
    },
    button: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '8px 14px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '12px'
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading payment history...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Payment History</h1>
        <p style={styles.text}>Track your water bill payments and receipts</p>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Receipt</th>
              <th style={styles.th}>Bill ID</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Transaction</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => {
                const paymentId = payment.id || payment.paymentId || payment.payment_id;

                return (
                  <tr key={paymentId}>
                    <td style={styles.td}>{payment.receiptNumber || payment.receipt_number}</td>
                    <td style={styles.td}>#{payment.billId || payment.bill_id}</td>
                    <td style={styles.td}>M {Number(payment.amountPaid || payment.amount_paid || 0).toFixed(2)}</td>
                    <td style={styles.td}>{payment.paymentMethod || payment.payment_method}</td>
                    <td style={styles.td}>{payment.transactionId || payment.transaction_id}</td>
                    <td style={styles.td}>
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString()
                        : payment.date
                          ? new Date(payment.date).toLocaleDateString()
                          : 'N/A'}
                    </td>
                    <td style={styles.td}>{payment.status || payment.payment_status}</td>
                    <td style={styles.td}>
                      <button style={styles.button} onClick={() => downloadReceipt(paymentId)}>
                        Receipt
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td style={styles.td} colSpan="8">
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;