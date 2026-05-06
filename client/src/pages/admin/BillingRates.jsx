import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const BillingIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke="#ffffff" strokeWidth="1.5" fill="none" />
    <path d="M12 8V16M9 10H15M9 14H15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TierIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#000000" strokeWidth="1.5" fill="none" />
    <path d="M7 8H17M7 12H14M7 16H11" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const RangeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M4 12H20M12 4V20" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" stroke="#000000" strokeWidth="1.5" fill="none" />
  </svg>
);

const RateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke="#000000" strokeWidth="1.5" fill="none" />
    <path d="M12 8V16M9 10H15M9 14H15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M4 7H20M10 11V17M14 11V17M6 7L7 21H17L18 7M9 7V4H15V7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SaveIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M5 13L9 17L19 7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CancelIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 6L18 18M18 6L6 18" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const tierOptions = [
  'Residential Basic',
  'Residential Standard',
  'Residential High Usage',
  'Residential Excessive Usage',
  'Commercial Basic',
  'Commercial High Usage'
];

const BillingRates = () => {
  const [rates, setRates] = useState([]);
  const [newRate, setNewRate] = useState({ tier: '', min: '', max: '', rate: '' });
  const [editingId, setEditingId] = useState(null);
  const [editRate, setEditRate] = useState({ tier: '', min: '', max: '', rate: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await api.get('/admin/rates');
      setRates(response.data.rates || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRate = async () => {
    if (!newRate.tier || !newRate.min || !newRate.max || !newRate.rate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await api.post('/admin/rates', newRate);
      await fetchRates();
      setNewRate({ tier: '', min: '', max: '', rate: '' });
      alert('Rate added successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add rate');
    }
  };

  const startEdit = (rate) => {
    const id = rate.id || rate.rate_id;

    setEditingId(id);
    setEditRate({
      tier: rate.tier || rate.rate_tier || '',
      min: rate.min ?? rate.usage_range_start ?? '',
      max: rate.max ?? rate.usage_range_end ?? '',
      rate: rate.rate ?? rate.cost_per_unit ?? ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRate({ tier: '', min: '', max: '', rate: '' });
  };

  const saveEdit = async (id) => {
    if (!editRate.tier || !editRate.min || !editRate.max || !editRate.rate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await api.put(`/admin/rates/${id}`, editRate);
      await fetchRates();
      cancelEdit();
      alert('Rate updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update rate');
    }
  };

  const deleteRate = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this billing rate?');

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/rates/${id}`);
      await fetchRates();
      alert('Rate deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete rate');
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
      padding: '40px',
      marginBottom: '30px',
      border: '2px solid #ffffff',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)'
    },
    heroTitle: {
      fontSize: '28px',
      marginBottom: '8px',
      fontWeight: '700',
      letterSpacing: '-0.5px'
    },
    heroText: {
      fontSize: '14px',
      color: '#cccccc'
    },
    card: {
      background: '#ffffff',
      padding: '30px',
      border: '2px solid #000000',
      marginBottom: '30px',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    cardTitle: {
      fontSize: '22px',
      marginBottom: '20px',
      fontWeight: '700',
      color: '#000000'
    },
    tableStyle: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    thStyle: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '14px',
      textAlign: 'left',
      fontSize: '13px',
      fontWeight: '600',
      border: '1px solid #333333'
    },
    tdStyle: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '13px',
      color: '#333333'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      marginBottom: '20px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000000',
      fontSize: '13px',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff'
    },
    btnPrimary: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '12px 20px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    btnEdit: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '6px 12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '12px',
      boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    btnDelete: {
      backgroundColor: '#b00020',
      color: '#ffffff',
      border: '2px solid #b00020',
      padding: '6px 12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '12px',
      boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    btnSave: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '6px 12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '12px',
      boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    btnCancel: {
      backgroundColor: '#666666',
      color: '#ffffff',
      border: '2px solid #666666',
      padding: '6px 12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '12px',
      boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    flexBetween: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    actionGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    },
    emptyRow: {
      textAlign: 'center',
      padding: '40px',
      color: '#999999',
      fontSize: '14px'
    },
    labelText: {
      fontSize: '13px',
      color: '#666666',
      marginBottom: '4px'
    },
    editInput: {
      width: '100%',
      padding: '8px',
      border: '2px solid #000000',
      fontSize: '12px',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{
          textAlign: 'center',
          padding: '60px',
          border: '2px solid #000000',
          backgroundColor: '#ffffff',
          boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
        }}>
          Loading billing rates...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <BillingIcon />
            Billing Rates Management
          </span>
        </h1>
        <p style={styles.heroText}>Configure water billing tiers and pricing</p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Current Billing Tiers</h3>

        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.thStyle}>
                <div style={styles.flexBetween}>
                  <TierIcon />
                  Tier
                </div>
              </th>
              <th style={styles.thStyle}>
                <div style={styles.flexBetween}>
                  <RangeIcon />
                  Range (m³)
                </div>
              </th>
              <th style={styles.thStyle}>
                <div style={styles.flexBetween}>
                  <RateIcon />
                  Rate (M/m³)
                </div>
              </th>
              <th style={styles.thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {rates.length > 0 ? (
              rates.map((rate) => {
                const id = rate.id || rate.rate_id;
                const isEditing = editingId === id;

                return (
                  <tr key={id}>
                    <td style={styles.tdStyle}>
                      {isEditing ? (
                        <div style={styles.flexBetween}>
                          <TierIcon />
                          <select
                            style={styles.editInput}
                            value={editRate.tier}
                            onChange={(e) => setEditRate({ ...editRate, tier: e.target.value })}
                          >
                            <option value="">Select Tier</option>
                            {tierOptions.map((tier) => (
                              <option key={tier} value={tier}>{tier}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div style={styles.flexBetween}>
                          <TierIcon />
                          {rate.tier || rate.rate_tier}
                        </div>
                      )}
                    </td>

                    <td style={styles.tdStyle}>
                      {isEditing ? (
                        <div style={styles.actionGroup}>
                          <input
                            style={styles.editInput}
                            type="number"
                            value={editRate.min}
                            onChange={(e) => setEditRate({ ...editRate, min: e.target.value })}
                          />
                          <input
                            style={styles.editInput}
                            type="number"
                            value={editRate.max}
                            onChange={(e) => setEditRate({ ...editRate, max: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div style={styles.flexBetween}>
                          <RangeIcon />
                          {rate.min ?? rate.usage_range_start} - {rate.max ?? rate.usage_range_end} m³
                        </div>
                      )}
                    </td>

                    <td style={styles.tdStyle}>
                      {isEditing ? (
                        <input
                          style={styles.editInput}
                          type="number"
                          step="0.01"
                          value={editRate.rate}
                          onChange={(e) => setEditRate({ ...editRate, rate: e.target.value })}
                        />
                      ) : (
                        <div style={styles.flexBetween}>
                          <RateIcon />
                          M {rate.rate ?? rate.cost_per_unit}
                        </div>
                      )}
                    </td>

                    <td style={styles.tdStyle}>
                      {isEditing ? (
                        <div style={styles.actionGroup}>
                          <button style={styles.btnSave} onClick={() => saveEdit(id)}>
                            <SaveIcon /> Save
                          </button>
                          <button style={styles.btnCancel} onClick={cancelEdit}>
                            <CancelIcon /> Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={styles.actionGroup}>
                          <button style={styles.btnEdit} onClick={() => startEdit(rate)}>
                            <EditIcon /> Edit
                          </button>
                          <button style={styles.btnDelete} onClick={() => deleteRate(id)}>
                            <DeleteIcon /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={styles.emptyRow}>
                  No billing rates found. Add your first rate below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Add New Rate Tier</h3>

        <div style={styles.gridContainer}>
          <div>
            <div style={styles.labelText}>Tier Name</div>
            <div style={styles.flexBetween}>
              <TierIcon />
              <select
                style={styles.input}
                value={newRate.tier}
                onChange={(e) => setNewRate({ ...newRate, tier: e.target.value })}
              >
                <option value="">Select Tier</option>
                {tierOptions.map((tier) => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div style={styles.labelText}>Min (m³)</div>
            <input
              style={styles.input}
              placeholder="0"
              type="number"
              value={newRate.min}
              onChange={(e) => setNewRate({ ...newRate, min: e.target.value })}
            />
          </div>

          <div>
            <div style={styles.labelText}>Max (m³)</div>
            <input
              style={styles.input}
              placeholder="10"
              type="number"
              value={newRate.max}
              onChange={(e) => setNewRate({ ...newRate, max: e.target.value })}
            />
          </div>

          <div>
            <div style={styles.labelText}>Rate (M/m³)</div>
            <input
              style={styles.input}
              placeholder="5.00"
              type="number"
              step="0.01"
              value={newRate.rate}
              onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
            />
          </div>
        </div>

        <button style={styles.btnPrimary} onClick={addRate}>
          <AddIcon /> Add Rate
        </button>
      </div>
    </div>
  );
};

export default BillingRates;