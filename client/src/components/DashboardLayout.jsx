import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = ({ user, onLogout }) => {
  const styles = {
    dashboardLayout: {
      display: 'flex',
      minHeight: 'calc(100vh - 70px)',
      backgroundColor: '#f5f5f5'
    },
    mainContent: {
      flex: 1,
      padding: '30px',
      overflowX: 'auto'
    }
  };

  return (
    <div style={styles.dashboardLayout}>
      <Sidebar user={user} onLogout={onLogout} />
      <main style={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;