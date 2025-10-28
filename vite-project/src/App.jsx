// Clandestine - Privacy-first social app for Don Bosco Technical College
// Main application component with routing

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Invite from './pages/Invite';
import Signup from './pages/Signup';
import Manifesto from './pages/Manifesto';
import Feed from './pages/Feed';
import Admin from './pages/Admin';
import { sessionManager, authAPI } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = sessionManager.getToken();
      
      if (!sessionToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authAPI.verify(sessionToken);
        if (response.authenticated) {
          setIsAuthenticated(true);
          setUser(response.user);
        } else {
          sessionManager.clearToken();
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        sessionManager.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-clandestine-darkest flex items-center justify-center">
          <div className="text-gray-400 text-lg">Verifying...</div>
        </div>
      );
    }
    
    return isAuthenticated ? children : <Navigate to="/" replace />;
  };

  // Handle login
  const handleLogin = (sessionToken, userData) => {
    sessionManager.setToken(sessionToken);
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    sessionManager.clearToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-clandestine-darkest flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing isAuthenticated={isAuthenticated} />} />
        <Route path="/invite/:token" element={<Invite />} />
        <Route path="/signup/:token" element={<Signup onLogin={handleLogin} />} />
        <Route 
          path="/manifesto" 
          element={
            <ProtectedRoute>
              <Manifesto user={user} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/feed" 
          element={
            <ProtectedRoute>
              <Feed user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
