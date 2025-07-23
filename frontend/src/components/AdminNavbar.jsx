"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { useContext } from "react"
import "../styles/AdminNavbar.css"

const AdminNavbar = () => {
  const { store, actions } = useContext(Context)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    return location.pathname === path
  }

  const onLogout = () => {
    actions.logout()
    navigate("/")
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

      <div className="admin-navbar-links">
        <Link to="/admin" className={`admin-nav-link ${isActive("/admin") ? "admin-active" : ""}`}>
          <i className="fas fa-users"></i>
          <span>Clientes</span>
        </Link>
        <Link to="/admin/cursos" className={`admin-nav-link ${isActive("/admin/cursos") ? "admin-active" : ""}`}>
          <i className="fas fa-book"></i>
          <span>Cursos</span>
        </Link>
      </div>

      <div className="admin-navbar-user">
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
    </nav>
  )
}

export default AdminNavbar
