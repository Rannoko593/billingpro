import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Tips from './pages/Tips';
import ContactUs from './pages/ContactUs';

import CustomerDashboard from './pages/customer/Dashboard';
import CustomerBills from './pages/customer/Bills';
import CustomerPaymentHistory from './pages/customer/PaymentHistory';
import CustomerWaterUsage from './pages/customer/WaterUsage';
import CustomerReportLeak from './pages/customer/ReportLeak';

import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerReports from './pages/manager/Reports';
import ManagerCustomers from './pages/manager/Customers';
import GenerateBill from './pages/manager/GenerateBill';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/UserManagement';
import AdminBillingRates from './pages/admin/BillingRates';
import AdminDatabaseStatus from './pages/admin/DatabaseStatus';
import AdminNotifications from './pages/admin/Notifications';
import AdminPayments from './pages/admin/Payments';

import MyNotifications from './pages/shared/MyNotifications';

const DashboardLayout = ({ children, user, onLogout }) => {
  const styles = {
    dashboardWrapper: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    },
    dashboardContainer: {
      display: 'flex',
      flex: 1
    },
    mainContent: {
      flex: 1,
      padding: '30px',
      overflowX: 'auto'
    }
  };

  return (
    <div style={styles.dashboardWrapper}>
      <div style={styles.dashboardContainer}>
        <Sidebar user={user} onLogout={onLogout} />
        <main style={styles.mainContent}>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const isDashboardPage =
    location.pathname.startsWith('/customer') ||
    location.pathname.startsWith('/manager') ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/notifications');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isDashboardPage && <Header user={user} />}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['customer', 'branch_manager', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <MyNotifications />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <CustomerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/bills"
            element={
              <ProtectedRoute allowedRoles={['customer', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <CustomerBills />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/payments"
            element={
              <ProtectedRoute allowedRoles={['customer', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <CustomerPaymentHistory />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/usage"
            element={
              <ProtectedRoute allowedRoles={['customer', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <CustomerWaterUsage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/report-leak"
            element={
              <ProtectedRoute allowedRoles={['customer', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <CustomerReportLeak />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={['branch_manager', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <ManagerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/reports"
            element={
              <ProtectedRoute allowedRoles={['branch_manager', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <ManagerReports />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/customers"
            element={
              <ProtectedRoute allowedRoles={['branch_manager', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <ManagerCustomers />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/generate-bill"
            element={
              <ProtectedRoute allowedRoles={['branch_manager', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <GenerateBill />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/notifications"
            element={
              <ProtectedRoute allowedRoles={['branch_manager', 'administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <AdminNotifications />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <AdminUserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/rates"
            element={
              <ProtectedRoute allowedRoles={['administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <AdminBillingRates />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/database"
            element={
              <ProtectedRoute allowedRoles={['administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <AdminDatabaseStatus />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={['administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <AdminNotifications />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['administrator']}>
                <DashboardLayout user={user} onLogout={handleLogout}>
                  <AdminPayments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {!isDashboardPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;