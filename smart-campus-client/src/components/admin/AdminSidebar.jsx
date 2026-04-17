import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaChartBar,
  FaQrcode,
  FaCalendarCheck,
  FaUsers,
  FaTools,
  FaBell,
  FaCog
} from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/admin/dashboard',
      icon: <FaTachometerAlt />,
      label: 'Dashboard'
    },
    {
      path: '/admin/resources',
      icon: <FaBoxOpen />,
      label: 'Resources'
    },
    {
      path: '/admin/bookings',
      icon: <FaCalendarCheck />,
      label: 'Booking Requests'
    },
  
    
    {
      path: '/admin/tickets',
      icon: <FaTools />,
      label: 'Tickets'
    },
  
    {
      path: '/admin/check-in',
      icon: <FaQrcode />,
      label: 'QR Check-in'
    },
    {
      path: '/admin/users',
      icon: <FaUsers />,
      label: 'Users'
    },
    {
      path: '/admin/notifications',
      icon: <FaBell />,
      label: 'Notifications'
    },
    {
      path: '/',
      label: 'Home'
    },
  ];

  return (
    <div className="admin-sidebar bg-dark text-white vh-100 position-fixed" style={{ width: '250px', left: 0 }}>
      <div className="p-3 border-bottom border-secondary">
        <h5 className="mb-0">Admin Panel</h5>
      </div>
      
      <Nav className="flex-column p-3">
        {navItems.map((item, index) => (
          <Nav.Item key={index} className="mb-2">
            <Nav.Link
              as={Link}
              to={item.path}
              className={`d-flex align-items-center text-white ${
                isActive(item.path) ? 'active bg-primary' : 'text-white'
              }`}
              style={{
                borderRadius: '5px',
                transition: 'all 0.3s ease'
              }}
            >
              <span className="me-3">{item.icon}</span>
              {item.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      
      <div className="position-absolute bottom-0 w-100 p-3 border-top border-secondary">
        <div className="text-muted small">
          <p className="mb-1">Smart Campus Admin</p>
          <p className="mb-0">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
