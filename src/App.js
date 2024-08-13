import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import OAuthCallback from './components/OAuthCallback';
import Dashboard from './components/Dashboard';
import DisplayMetrics from './components/DisplayMetrics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/display-metrics" element={<DisplayMetrics />} />
      </Routes>
    </Router>
  );
}

export default App;