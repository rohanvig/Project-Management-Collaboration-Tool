import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem 2rem', 
      backgroundColor: 'var(--card-bg)',
      borderBottom: '1px solid var(--border-color)',
      marginBottom: '2rem'
    }}>
      <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>ProjectManager</h2>
      <div>
        <span style={{ marginRight: '1rem' }}>Welcome, {user.name}</span>
        <button className="btn" onClick={handleLogout} style={{ backgroundColor: 'var(--text-muted)' }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
