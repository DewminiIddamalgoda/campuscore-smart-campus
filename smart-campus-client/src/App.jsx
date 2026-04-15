import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/Home/HomePage';
import BookingPage from './pages/bookings/BookingPage';
import ResourceListPage from './pages/resources/ResourceListPage';
import ResourceDetailsPage from './pages/resources/ResourceDetailsPage';
import AddResourcePage from './pages/resources/AddResourcePage';
import AddResourceAdmin from './pages/resources/AddResourceAdmin';
import EditResourcePage from './pages/resources/EditResourcePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminResources from './pages/admin/AdminResources';
import AdminResourceDetails from './pages/resources/adminResourceDetails';
import TestPage from './pages/TestPage';
import 'bootstrap/dist/css/bootstrap.min.css';

// User Layout Component
const UserLayout = ({ children }) => (
  <div className="user-layout d-flex flex-column min-vh-100">
    <Header isAdmin={false} />
    <main className="flex-grow-1">
      {children}
    </main>
    <Footer />
  </div>
);

// Admin Layout Component
const AdminLayoutWrapper = ({ children }) => (
  <AdminLayout>
    {children}
  </AdminLayout>
);

function App() {
  console.log('App component rendered');
  
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
          <Route path="/bookings" element={<UserLayout><BookingPage /></UserLayout>} />
          <Route path="/resources" element={<UserLayout><ResourceListPage /></UserLayout>} />
          <Route path="/resources/:id" element={<UserLayout><ResourceDetailsPage /></UserLayout>} />
          <Route path="/resources/add" element={<UserLayout><AddResourcePage /></UserLayout>} />
          <Route path="/resources/edit/:id" element={<UserLayout><EditResourcePage /></UserLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminLayoutWrapper><AdminDashboard /></AdminLayoutWrapper>} />
          <Route path="/admin/resources" element={<AdminLayoutWrapper><AdminResources /></AdminLayoutWrapper>} />
          <Route path="/admin/resources/:id" element={<AdminLayoutWrapper><AdminResourceDetails /></AdminLayoutWrapper>} />
          <Route path="/admin/resources/add" element={<AdminLayoutWrapper><AddResourceAdmin /></AdminLayoutWrapper>} />
          
          {/* Test Routes */}
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/:id" element={<TestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
