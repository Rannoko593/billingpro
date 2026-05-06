import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const Reports = () => {
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    scope: 'single',
    accountNumber: '',
    district: '',
    period: 'monthly',
    reportType: 'bar'
  });

  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/manager/customers');
      setCustomers(res.data.customers || []);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load customers');
    }
  };

  const handleScopeChange = (e) => {
    setForm({
      ...form,
      scope: e.target.value,
      accountNumber: '',
      district: ''
    });
    setReport(null);
  };

  const generateReport = async () => {
    if (form.scope === 'single' && !form.accountNumber) {
      alert('Select customer');
      return;
    }

    if (form.scope === 'district' && !form.district) {
      alert('Select district');
      return;
    }

    try {
      const res = await api.get('/manager/reports', {
        params: form
      });

      setReport(res.data.report);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to generate report');
    }
  };

  const selectedCustomer = customers.find(
    (c) => c.accountNumber === form.accountNumber
  );

  const chartData = report
    ? [
        { label: 'Usage', value: Number(report.totalUsage || 0), unit: 'm³' },
        { label: 'Billed', value: Number(report.totalBilled || 0), unit: 'M' },
        { label: 'Paid', value: Number(report.totalPaid || 0), unit: 'M' },
        { label: 'Outstanding', value: Number(report.outstanding || 0), unit: 'M' }
      ]
    : [];

  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },

    hero: {
      backgroundColor: '#000',
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
      marginBottom: '30px',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },

    summaryCard: {
      background: '#fff',
      padding: '18px',
      border: '2px solid #000',
      marginBottom: '30px',
      boxShadow: '6px 6px 0 rgba(0,0,0,0.1)'
    },

    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px'
    },

    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px'
    },

    miniBox: {
      border: '2px solid #000',
      padding: '10px',
      background: '#fff'
    },

    label: {
      fontSize: '12px',
      fontWeight: '700',
      color: '#666',
      marginBottom: '5px'
    },

    value: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#000'
    },

    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000',
      marginBottom: '15px',
      boxSizing: 'border-box',
      background: '#fff'
    },

    button: {
      background: '#000',
      color: '#fff',
      padding: '12px 20px',
      border: '2px solid #000',
      cursor: 'pointer',
      fontWeight: '700',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },

    barRow: {
      display: 'grid',
      gridTemplateColumns: '120px 1fr 110px',
      gap: '10px',
      alignItems: 'center',
      marginBottom: '12px'
    },

    barOuter: {
      border: '2px solid #000',
      height: '24px',
      background: '#fff'
    },

    barInner: {
      background: '#000',
      height: '100%'
    },

    pie: {
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      border: '2px solid #000',
      margin: '20px auto',
      background:
        'conic-gradient(#000 0deg 90deg, #333 90deg 180deg, #777 180deg 270deg, #ccc 270deg 360deg)'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1>Generate Report</h1>
        <p>Generate customer, all-customer, or district-based billing reports</p>
      </div>

      <div style={styles.card}>
        <h3>Report Form</h3>

        <div style={styles.grid}>
          <div>
            <div style={styles.label}>Report Type</div>
            <select
              style={styles.input}
              value={form.scope}
              onChange={handleScopeChange}
            >
              <option value="single">Single Customer</option>
              <option value="all">All Customers</option>
              <option value="district">District / Segment</option>
            </select>
          </div>

          {form.scope === 'single' && (
            <div>
              <div style={styles.label}>Customer Name and Account</div>
              <select
                style={styles.input}
                value={form.accountNumber}
                onChange={(e) =>
                  setForm({ ...form, accountNumber: e.target.value })
                }
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.accountNumber} value={c.accountNumber}>
                    {c.name} - {c.accountNumber}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.scope === 'district' && (
            <div>
              <div style={styles.label}>District / Segment</div>
              <select
                style={styles.input}
                value={form.district}
                onChange={(e) =>
                  setForm({ ...form, district: e.target.value })
                }
              >
                <option value="">Select District</option>
                <option value="Maseru">Maseru</option>
                <option value="Leribe">Leribe</option>
                <option value="Berea">Berea</option>
                <option value="Mafeteng">Mafeteng</option>
                <option value="Mohale's Hoek">Mohale's Hoek</option>
                <option value="Quthing">Quthing</option>
                <option value="Qacha's Nek">Qacha's Nek</option>
                <option value="Mokhotlong">Mokhotlong</option>
                <option value="Thaba-Tseka">Thaba-Tseka</option>
                <option value="Botha-Bothe">Botha-Bothe</option>
              </select>
            </div>
          )}

          <div>
            <div style={styles.label}>Report Period</div>
            <select
              style={styles.input}
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <div style={styles.label}>Chart Type</div>
            <select
              style={styles.input}
              value={form.reportType}
              onChange={(e) =>
                setForm({ ...form, reportType: e.target.value })
              }
            >
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
            </select>
          </div>
        </div>

        <button style={styles.button} onClick={generateReport}>
          Generate
        </button>
      </div>

      {report && (
        <>
          <div style={styles.summaryCard}>
            <h3>Report Summary</h3>

            <div style={styles.summaryGrid}>
              <div style={styles.miniBox}>
                <div style={styles.label}>Report Type</div>
                <div style={styles.value}>
                  {form.scope === 'single'
                    ? 'Single Customer'
                    : form.scope === 'all'
                    ? 'All Customers'
                    : 'District / Segment'}
                </div>
              </div>

              <div style={styles.miniBox}>
                <div style={styles.label}>Customer / District</div>
                <div style={styles.value}>
                  {form.scope === 'single'
                    ? selectedCustomer?.name || 'N/A'
                    : form.scope === 'district'
                    ? form.district
                    : 'All Customers'}
                </div>
              </div>

              <div style={styles.miniBox}>
                <div style={styles.label}>Usage</div>
                <div style={styles.value}>
                  {Number(report.totalUsage || 0).toFixed(2)} m³
                </div>
              </div>

              <div style={styles.miniBox}>
                <div style={styles.label}>Billed</div>
                <div style={styles.value}>
                  M {Number(report.totalBilled || 0).toFixed(2)}
                </div>
              </div>

              <div style={styles.miniBox}>
                <div style={styles.label}>Paid</div>
                <div style={styles.value}>
                  M {Number(report.totalPaid || 0).toFixed(2)}
                </div>
              </div>

              <div style={styles.miniBox}>
                <div style={styles.label}>Outstanding</div>
                <div style={styles.value}>
                  M {Number(report.outstanding || 0).toFixed(2)}
                </div>
              </div>

              <div style={styles.miniBox}>
                <div style={styles.label}>Customers</div>
                <div style={styles.value}>{report.customers || 0}</div>
              </div>

              <div style={styles.miniBox}>
                <div style={styles.label}>Collection Rate</div>
                <div style={styles.value}>
                  {report.collectionRate || '0.0'}%
                </div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3>Chart</h3>

            {form.reportType === 'bar' ? (
              chartData.map((item) => (
                <div key={item.label} style={styles.barRow}>
                  <div>{item.label}</div>

                  <div style={styles.barOuter}>
                    <div
                      style={{
                        ...styles.barInner,
                        width: `${(item.value / maxValue) * 100}%`
                      }}
                    />
                  </div>

                  <div>
                    {item.unit === 'M'
                      ? `M ${item.value.toFixed(2)}`
                      : `${item.value.toFixed(2)} m³`}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.pie}></div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;