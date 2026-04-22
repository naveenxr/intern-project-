import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BoardView from './pages/BoardView';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

/* ── Spinner for auth loading state ── */
const FullPageSpinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-main)' }}>
    <div className="spinner" />
  </div>
);

/* ── Route guard ── */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/* ── App shell ── */
const AppContent = () => {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userData = params.get('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userData));
        parsedUser.token = token;
        localStorage.setItem('smarttask_user', JSON.stringify(parsedUser));
        setUser(parsedUser);
        // Clean URL
        navigate('/dashboard', { replace: true });
      } catch (e) {
        console.error('Failed to parse user from URL');
      }
    }
  }, [navigate, setUser]);

  if (loading) return <FullPageSpinner />;

  return (
    <>
      {user && <Navbar />}
      <main className={user ? 'container' : ''}>
        <Routes>
          <Route path="/login"     element={!user ? <Login />    : <Navigate to="/dashboard" replace />} />
          <Route path="/register"  element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/board/:id" element={<ProtectedRoute><BoardView /></ProtectedRoute>} />
          <Route path="/"          element={<Navigate to="/dashboard" replace />} />
          <Route path="*"          element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <TaskProvider>
            <AppContent />
          </TaskProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
