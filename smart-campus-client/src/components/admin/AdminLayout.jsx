import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout d-flex">
      <AdminSidebar />
      <div className="admin-main-content" style={{ marginLeft: '250px', flex: 1, minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
