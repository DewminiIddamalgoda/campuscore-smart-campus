import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home/HomePage';
import ResourceListPage from './pages/Resource/ResourceListPage';
import ResourceDetailsPage from './pages/Resource/ResourceDetailsPage';
import AddResourcePage from './pages/Resource/AddResourcePage';
import EditResourcePage from './pages/Resource/EditResourcePage';
import TestPage from './pages/TestPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  console.log('App component rendered');
  
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<ResourceListPage />} />
          <Route path="/resources/:id" element={<ResourceDetailsPage />} />
          <Route path="/resources/add" element={<AddResourcePage />} />
          <Route path="/resources/edit/:id" element={<EditResourcePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/:id" element={<TestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
