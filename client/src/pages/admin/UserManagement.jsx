import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

// SVG Icons - No emojis
const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="8" r="3" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
    <path d="M3 17V16C3 13.5 5 12 7 12H11C13 12 15 13.5 15 16V17" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="7" r="2.5" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
    <path d="M21 17V16C21 14 19.5 12.5 18 12" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="#333333" strokeWidth="1.5" fill="none"/>
    <path d="M5 20V19C5 15 8 13 12 13C16 13 19 15 19 19V20" stroke="#333333" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#333333" strokeWidth="1.5" fill="none"/>
    <path d="M22 7L12 14L2 7" stroke="#333333" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const AccountIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#333333" strokeWidth="1.5" fill="none"/>
    <path d="M7 9H17M7 13H13" stroke="#333333" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 3H9.5L11.5 8L9 10C10 13 13 16 16 16L18 13.5L23 15.5V18.5C23 20 21.5 22 20 22C10 22 2 14 2 4C2 2.5 4 1 5.5 1H8.5L10.5 6L8.5 8.5" stroke="#333333" strokeWidth="1.5" fill="none"/>
  </svg>
);

const RoleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 8H22L16 12L19 18L12 14L5 18L8 12L2 8H9L12 2Z" stroke="#333333" strokeWidth="1.5" fill="none"/>
  </svg>
);

const StatusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#333333" strokeWidth="1.5" fill="none"/>
    <path d="M12 8V12L15 15" stroke="#333333" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 7H20M10 11V16M14 11V16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 7L6 19C6 20.5 7 21 8 21H16C17 21 18 20.5 18 19L19 7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 7L10 3H14L15 7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="#333333" strokeWidth="1.5" fill="none"/>
    <path d="M21 21L17 17" stroke="#333333" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M6 12H18M8 18H16" stroke="#333333" strokeWidth="1.5" strokeLinecap="round"/>
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

const emptyForm = {
  name: '',
  email: '',
  accountNumber: '',
  phone: '',
  address: '',
  district: '',
  role: 'customer',
  status: 'active',
  password: ''
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUserId = (user) => user.id || user.customer_id;

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setEditingId(getUserId(user));
    setFormData({
      name: user.name || '',
      email: user.email || '',
      accountNumber: user.accountNumber || user.account_number || '',
      phone: user.phone || '',
      address: user.address || '',
      district: user.district || '',
      role: user.role || 'customer',
      status: user.status || 'active',
      password: ''
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const saveUser = async () => {
    if (!formData.name || !formData.email || !formData.accountNumber) {
      alert('Name, email and account number are required');
      return;
    }

    if (!editingId && !formData.password) {
      alert('Password is required when adding a new user');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/admin/users/${editingId}`, formData);
        alert('User updated successfully');
      } else {
        await api.post('/admin/users', formData);
        alert('User added successfully');
      }

      await fetchUsers();
      closeForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save user');
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
      alert('User role updated successfully');
    } catch (error) {
      alert('Failed to update role');
    }
  };

  const updateStatus = async (userId, newStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      fetchUsers();
      alert('User status updated successfully');
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
        alert('User deleted successfully');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const account = user.accountNumber || user.account_number || '';
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

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
      overflowX: 'auto',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    formCard: {
      background: '#ffffff',
      padding: '30px',
      border: '2px solid #000000',
      marginBottom: '30px',
      boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
    },
    formTitle: {
      fontSize: '22px',
      marginBottom: '20px',
      fontWeight: '700',
      color: '#000000'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '18px',
      marginBottom: '20px'
    },
    labelText: {
      fontSize: '13px',
      color: '#666666',
      marginBottom: '4px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #000000',
      fontSize: '13px',
      boxSizing: 'border-box',
      backgroundColor: '#ffffff'
    },
    formActions: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    btnSave: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '10px 20px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    btnCancel: {
      backgroundColor: '#666666',
      color: '#ffffff',
      border: '2px solid #666666',
      padding: '10px 20px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    tableStyle: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '900px'
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
    select: {
      padding: '8px',
      border: '2px solid #000000',
      fontSize: '12px',
      background: '#ffffff',
      cursor: 'pointer',
      borderRadius: '0px'
    },
    btnDelete: {
      backgroundColor: '#dc3545',
      color: '#ffffff',
      border: '2px solid #dc3545',
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      marginLeft: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '2px 2px 0 rgba(0,0,0,0.1)'
    },
    btnEdit: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '2px 2px 0 rgba(0,0,0,0.1)'
    },
    statusActive: {
      color: '#28a745',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    statusInactive: {
      color: '#dc3545',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    searchBox: {
      marginBottom: '24px',
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    searchInput: {
      padding: '10px',
      border: '2px solid #000000',
      fontSize: '13px',
      width: '250px',
      backgroundColor: '#ffffff'
    },
    filterSelect: {
      padding: '10px',
      border: '2px solid #000000',
      fontSize: '13px',
      background: '#ffffff',
      cursor: 'pointer'
    },
    addButton: {
      backgroundColor: '#000000',
      color: '#ffffff',
      border: '2px solid #000000',
      padding: '10px 20px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginLeft: 'auto',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
    },
    actionContainer: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    tableHeaderContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px', border: '2px solid #000000', backgroundColor: '#ffffff', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)' }}>
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>User Management</h1>
        <p style={styles.heroText}>Manage user accounts, roles, and permissions</p>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>{editingId ? 'Edit User' : 'Add New User'}</h3>

          <div style={styles.formGrid}>
            <div>
              <div style={styles.labelText}>Full Name</div>
              <input
                style={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
              />
            </div>

            <div>
              <div style={styles.labelText}>Email</div>
              <input
                style={styles.input}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email address"
              />
            </div>

            <div>
              <div style={styles.labelText}>Account Number</div>
              <input
                style={styles.input}
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="ACC001"
              />
            </div>

            <div>
              <div style={styles.labelText}>Phone</div>
              <input
                style={styles.input}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>

            <div>
              <div style={styles.labelText}>Address</div>
              <input
                style={styles.input}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
              />
            </div>

            <div>
              <div style={styles.labelText}>District</div>
              <input
                style={styles.input}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="District"
              />
            </div>

            <div>
              <div style={styles.labelText}>Role</div>
              <select
                style={styles.input}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="customer">Customer</option>
                <option value="branch_manager">Branch Manager</option>
                <option value="administrator">Administrator</option>
              </select>
            </div>

            <div>
              <div style={styles.labelText}>Status</div>
              <select
                style={styles.input}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <div style={styles.labelText}>{editingId ? 'New Password (optional)' : 'Password'}</div>
              <input
                style={styles.input}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingId ? 'Leave empty to keep old password' : 'Password'}
              />
            </div>
          </div>

          <div style={styles.formActions}>
            <button style={styles.btnSave} onClick={saveUser}>
              <SaveIcon /> {editingId ? 'Save Changes' : 'Add User'}
            </button>

            <button style={styles.btnCancel} onClick={closeForm}>
              <CancelIcon /> Cancel
            </button>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.searchBox}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search by name, email or account..." 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select style={styles.filterSelect} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="branch_manager">Branch Manager</option>
            <option value="administrator">Administrator</option>
          </select>

          <select style={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button style={styles.addButton} onClick={openAddForm}>
            <AddIcon /> Add New User
          </button>
        </div>

        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.thStyle}><div style={styles.tableHeaderContent}><UserIcon /> Name</div></th>
              <th style={styles.thStyle}><div style={styles.tableHeaderContent}><EmailIcon /> Email</div></th>
              <th style={styles.thStyle}><div style={styles.tableHeaderContent}><AccountIcon /> Account #</div></th>
              <th style={styles.thStyle}><div style={styles.tableHeaderContent}><PhoneIcon /> Phone</div></th>
              <th style={styles.thStyle}><div style={styles.tableHeaderContent}><RoleIcon /> Role</div></th>
              <th style={styles.thStyle}><div style={styles.tableHeaderContent}><StatusIcon /> Status</div></th>
              <th style={styles.thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#999999' }}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const userId = getUserId(user);
                const account = user.accountNumber || user.account_number || '';

                return (
                  <tr key={userId}>
                    <td style={styles.tdStyle}>
                      <strong>{user.name}</strong>
                    </td>

                    <td style={styles.tdStyle}>{user.email}</td>

                    <td style={styles.tdStyle}>{account}</td>

                    <td style={styles.tdStyle}>{user.phone || 'N/A'}</td>

                    <td style={styles.tdStyle}>
                      <select 
                        style={styles.select} 
                        value={user.role} 
                        onChange={(e) => updateRole(userId, e.target.value)}
                      >
                        <option value="customer">Customer</option>
                        <option value="branch_manager">Branch Manager</option>
                        <option value="administrator">Administrator</option>
                      </select>
                    </td>

                    <td style={styles.tdStyle}>
                      <select 
                        style={styles.select} 
                        value={user.status} 
                        onChange={(e) => updateStatus(userId, e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>

                    <td style={styles.tdStyle}>
                      <div style={styles.actionContainer}>
                        <button 
                          style={styles.btnEdit} 
                          onClick={() => openEditForm(user)}
                        >
                          <EditIcon /> Edit
                        </button>

                        <button 
                          style={styles.btnDelete} 
                          onClick={() => deleteUser(userId)}
                        >
                          <DeleteIcon /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;