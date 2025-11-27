"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { useContext, useState } from "react"
import "../styles/AdminNavbar.css"

const AdminNavbar = () => {
  const { store, actions } = useContext(Context)
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  const onLogout = () => {
    actions.logout()
    navigate("/")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Obtener inicial del email del usuario
  const getUserInitial = () => {
    if (store.user && store.user.email) {
      return store.user.email.charAt(0).toUpperCase()
    }
    return "A" // Fallback
  }

  const getUserName = () => {
    if (store.user && store.user.email) {
      return store.user.email.split("@")[0]
    }
    return "Admin"
  }

  return (
    <nav className="admin-navbar-container">
      <div className="admin-navbar-logo">
        <Link to="/admin" className="admin-logo-link">
          <div className="admin-logo-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <span className="admin-logo-text">ABCD Admin</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="admin-navbar-links desktop-only">
        <Link to="/admin" className={`admin-nav-link ${isActive("/admin") ? "admin-active" : ""}`}>
          <i className="fas fa-users"></i>
          <span>Clientes</span>
        </Link>
        <Link to="/admin/cursos" className={`admin-nav-link ${isActive("/admin/cursos") ? "admin-active" : ""}`}>
          <i className="fas fa-book"></i>
          <span>Cursos</span>
        </Link>
        <Link to="/admin/idiomas" className={`admin-nav-link ${isActive("/admin/idiomas") ? "admin-active" : ""}`}>
          <i className="fas fa-language"></i>
          <span>Idiomas</span>
        </Link>
        <Link to="/admin/servicios" className={`admin-nav-link ${isActive("/admin/servicios") ? "admin-active" : ""}`}>
          <i className="fas fa-concierge-bell"></i>
          <span>Servicios</span>
        </Link>
        <Link to="/admin/destinos" className={`admin-nav-link ${isActive("/admin/destinos") ? "admin-active" : ""}`}>
          <i className="fas fa-map-marker-alt"></i>
          <span>Destinos</span>
        </Link>
      </div>

      {/* Desktop User Section */}
      <div className="admin-navbar-user desktop-only">
        <div className="admin-user-info">
          <div className="admin-user-avatar">
            <span>{getUserInitial()}</span>
          </div>
          <span className="admin-user-name">{getUserName()}</span>
        </div>
        <button className="admin-logout-btn" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Salir</span>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button className="admin-mobile-menu-btn mobile-only" onClick={toggleMobileMenu} aria-label="Toggle menu">
        <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="admin-mobile-overlay" onClick={closeMobileMenu}>
          <div className="admin-mobile-menu" onClick={(e) => e.stopPropagation()}>
            {/* Mobile User Info */}
            <div className="admin-mobile-user-section">
              <div className="admin-user-avatar">
                <span>{getUserInitial()}</span>
              </div>
              <div className="admin-mobile-user-info">
                <span className="admin-mobile-user-name">{getUserName()}</span>
                <span className="admin-mobile-user-role">Administrador</span>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="admin-mobile-nav-links">
              <Link
                to="/admin"
                className={`admin-mobile-nav-link ${isActive("/admin") ? "admin-active" : ""}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-users"></i>
                <span>Clientes</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
              <Link
                to="/admin/cursos"
                className={`admin-mobile-nav-link ${isActive("/admin/cursos") ? "admin-active" : ""}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-book"></i>
                <span>Cursos</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
              <Link
                to="/admin/idiomas"
                className={`admin-mobile-nav-link ${isActive("/admin/idiomas") ? "admin-active" : ""}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-language"></i>
                <span>Idiomas</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
              <Link
                to="/admin/servicios"
                className={`admin-mobile-nav-link ${isActive("/admin/servicios") ? "admin-active" : ""}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-concierge-bell"></i>
                <span>Servicios</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
              <Link
                to="/admin/destinos"
                className={`admin-mobile-nav-link ${isActive("/admin/destinos") ? "admin-active" : ""}`}
                onClick={closeMobileMenu}
              >
                <i className="fas fa-map-marker-alt"></i>
                <span>Destinos</span>
                <i className="fas fa-chevron-right"></i>
              </Link>
            </div>

            {/* Mobile Logout Button */}
            <button className="admin-mobile-logout-btn" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default AdminNavbar
