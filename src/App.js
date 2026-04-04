// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar   from './components/Navbar';
import Footer   from './components/Footer';

import Home     from './pages/Home';
import About    from './pages/About';
import Events   from './pages/Events';
import Gallery  from './pages/Gallery';
import Contact  from './pages/Contact';
import Register from './pages/Register';
import Login    from './pages/Login';

import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents    from './pages/admin/AdminEvents';
import AdminGallery   from './pages/admin/AdminGallery';
import AdminMembers   from './pages/admin/AdminMembers';
import AdminMessages  from './pages/admin/AdminMessages';
import AdminAbout     from './pages/admin/AdminAbout';
import AdminHistory   from './pages/admin/AdminHistory';
import AdminBloodList from './pages/admin/AdminBloodList';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{padding:'3rem',textAlign:'center',color:'#888'}}>Loading...</div>;
  return user?.role === 'admin' ? children : <Navigate to="/admin/login" />;
};

const PublicLayout = ({ children }) => (
  <><Navbar />{children}<Footer /></>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about"   element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/events"  element={<PublicLayout><Events /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/register"element={<PublicLayout><Register /></PublicLayout>} />
          <Route path="/login"   element={<PublicLayout><Login /></PublicLayout>} />

          {/* Admin */}
          <Route path="/admin/login"       element={<AdminLogin />} />
          <Route path="/admin"             element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/events"      element={<AdminRoute><AdminEvents /></AdminRoute>} />
          <Route path="/admin/gallery"     element={<AdminRoute><AdminGallery /></AdminRoute>} />
          <Route path="/admin/members"     element={<AdminRoute><AdminMembers /></AdminRoute>} />
          <Route path="/admin/messages"    element={<AdminRoute><AdminMessages /></AdminRoute>} />
          <Route path="/admin/about"       element={<AdminRoute><AdminAbout /></AdminRoute>} />
          <Route path="/admin/history"     element={<AdminRoute><AdminHistory /></AdminRoute>} />
          <Route path="/admin/blood-list"  element={<AdminRoute><AdminBloodList /></AdminRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
