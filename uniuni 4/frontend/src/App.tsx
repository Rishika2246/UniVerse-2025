import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { MainDashboard } from './components/MainDashboard';
import EdgeCaseShowcase from './components/EdgeCaseShowcase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showEdgeCases, setShowEdgeCases] = useState(false);

  // Check URL for edge case demo
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'edge-cases') {
      setShowEdgeCases(true);
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Show Edge Case Showcase if demo parameter is present
  if (showEdgeCases) {
    return <EdgeCaseShowcase />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <MainDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
