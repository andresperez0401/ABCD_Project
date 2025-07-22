// src/components/admin/AdminNavbar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { useContext} from 'react';
import '../styles/AdminNavbar.css';

const AdminNavbar = () => {
  const { actions } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const onLogout = () => {
    actions.logout();   
    navigate('/');
}

  return (
    <nav className="admin-navbar">
      <div className="navbar-logo">
        <Link to="/admin">
          <i className="fas fa-globe-americas"></i>
          <span>ABCDadmin</span>
        </Link>
      </div>
      
      <div className="navbar-links">
        {/* <Link 
          to="/admin/clientes" 
          className={`nav-link ${isActive('/admin/clientes') ? 'active' : ''}`}
        > */}
          <i className="fas fa-users"></i> Clientes
        {/* </Link>
        <Link 
          to="/admin/cursos" 
          className={`nav-link ${isActive('/admin/cursos') ? 'active' : ''}`}
        > */}
          <i className="fas fa-book"></i> Cursos
        {/* </Link>
        <Link 
          to="/admin/destinos" 
          className={`nav-link ${isActive('/admin/destinos') ? 'active' : ''}`}
        > */}
          <i className="fas fa-map-marker-alt"></i> Destinos
        {/* </Link> */}
        {/* <Link 
          to="/admin/estadisticas" 
          className={`nav-link ${isActive('/admin/estadisticas') ? 'active' : ''}`}
        > */}
          <i className="fas fa-chart-bar"></i> Estadísticas
        {/* </Link> */}
      </div>
      
      <div className="navbar-user">
        <button className="user-menu">
          <i className="fas fa-user-circle"></i>
          <span>Admin</span>
          <i className="fas fa-caret-down"></i>
        </button>
        <button 
          className="logout-btn"
          onClick={onLogout}
        >
          <i className="fas fa-sign-out-alt"></i> Salir
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;