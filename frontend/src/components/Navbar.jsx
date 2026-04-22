import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, LogOut, Sun, Moon, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass" style={{
      padding: '0.9rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
    }}>
      <div className="container flex justify-between align-center">
        {/* Brand */}
        <Link
          to="/dashboard"
          className="flex align-center gap-1"
          style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), #818cf8)',
            color: 'white',
            padding: '0.4rem',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Layout size={18} />
          </div>
          <span>Smart<span style={{ color: 'var(--text-main)' }}>Task</span></span>
        </Link>

        {/* Right controls */}
        <div className="flex align-center gap-2">
          {/* Dark mode toggle */}
          <button
            id="dark-mode-toggle"
            className="btn-ghost"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ padding: '0.5rem', borderRadius: '9px' }}
          >
            {darkMode
              ? <Sun size={18} style={{ color: 'var(--warning)' }} />
              : <Moon size={18} />}
          </button>

          {/* User info */}
          <Link
            to="/profile"
            className="flex align-center gap-1"
            style={{
              background: 'var(--primary-light)',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--primary)',
              textDecoration: 'none',
              transition: 'transform var(--transition), box-shadow var(--transition)',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
                <User size={16} />
            )}
            <span>{user?.name}</span>
          </Link>

          {/* Logout */}
          <button
            id="logout-btn"
            className="btn-ghost"
            onClick={handleLogout}
            title="Logout"
            style={{ padding: '0.5rem', borderRadius: '9px', color: 'var(--danger)' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
