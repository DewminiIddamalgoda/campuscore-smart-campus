import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import HomePage from './pages/Home/HomePage';
import BookingPage from './pages/bookings/BookingPage';
import ResourceListPage from './pages/resources/ResourceListPage';
import ResourceDetailsPage from './pages/resources/ResourceDetailsPage';
import AddResourcePage from './pages/resources/AddResourcePage';
import AddResourceAdmin from './pages/resources/AddResourceAdmin';
import EditResourcePage from './pages/resources/EditResourcePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminResources from './pages/admin/AdminResources';
import AdminQrCheckInPage from './pages/admin/AdminQrCheckInPage';
import AdminBookingRequests from './pages/admin/AdminBookingRequests';
import AdminResourceDetails from './pages/resources/adminResourceDetails';
import TestPage from './pages/TestPage';
import TicketsPage from './pages/SupportTicket/TicketsPage';
import AdminTicketsPage from './pages/admin/AdminTicketsPage';
import RegistrationSelectionPage from './pages/auth/RegistrationSelectionPage';
import RegistrationPage from './pages/auth/RegistrationPage';
import OAuthCallbackPage from './pages/auth/OAuthCallbackPage';
import UserProfile from './pages/Profile/UserProfile';
import EditProfile from './pages/Profile/EditProfile';
import UserNotificationsPage from './pages/Profile/UserNotificationsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import UserTicketsPage from "./pages/Profile/UserTicketsPage";

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
          <Route path="/register" element={<UserLayout><RegistrationSelectionPage /></UserLayout>} />
          <Route path="/register/:role" element={<UserLayout><RegistrationPage /></UserLayout>} />
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/bookings" element={<UserLayout><BookingPage /></UserLayout>} />
          <Route path="/profile" element={<ProtectedRoute><UserLayout><UserProfile /></UserLayout></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><UserLayout><EditProfile /></UserLayout></ProtectedRoute>} />
          <Route path="/profile/notifications" element={<ProtectedRoute><UserLayout><UserNotificationsPage /></UserLayout></ProtectedRoute>} />
          <Route path="/resources" element={<UserLayout><ResourceListPage /></UserLayout>} />
          <Route path="/resources/:id" element={<UserLayout><ResourceDetailsPage /></UserLayout>} />
          <Route path="/resources/add" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><UserLayout><AddResourcePage /></UserLayout></ProtectedRoute>} />
          <Route path="/resources/edit/:id" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><UserLayout><EditResourcePage /></UserLayout></ProtectedRoute>} />
          <Route path="/tickets" element={<UserLayout><TicketsPage /></UserLayout>} />
          <Route path="/profile/tickets" element={<UserLayout><UserTicketsPage /></UserLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><AdminLayoutWrapper><AdminDashboard /></AdminLayoutWrapper></ProtectedRoute>} />
          <Route path="/admin/resources" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><AdminLayoutWrapper><AdminResources /></AdminLayoutWrapper></ProtectedRoute>} />
          <Route path="/admin/check-in" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><AdminLayoutWrapper><AdminQrCheckInPage /></AdminLayoutWrapper></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><AdminLayoutWrapper><AdminBookingRequests /></AdminLayoutWrapper></ProtectedRoute>} />
          <Route path="/admin/resources/:id" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><AdminLayoutWrapper><AdminResourceDetails /></AdminLayoutWrapper></ProtectedRoute>} />
          <Route path="/admin/resources/add" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><AdminLayoutWrapper><AddResourceAdmin /></AdminLayoutWrapper></ProtectedRoute>} />
          <Route path="/admin/tickets" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><AdminLayoutWrapper><AdminTicketsPage /></AdminLayoutWrapper></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}><AdminLayoutWrapper><AdminNotificationsPage /></AdminLayoutWrapper></ProtectedRoute>} />
          
          
          {/* Test Routes */}
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/:id" element={<TestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
