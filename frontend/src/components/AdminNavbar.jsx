"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { Context } from "../store/appContext"
import { useContext } from "react"
import "../styles/AdminNavbar.css"

const AdminNavbar = () => {
  const { actions } = useContext(Context)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    return location.pathname === path
  }

  const onLogout = () => {
    actions.logout()
    navigate("/")
  }

  return (
    <nav className="admin-navbar-container">
      <div className="admin-navbar-logo">
        <Link to="/admin" className="admin-logo-link">
          <div className="admin-logo-icon">
            <i className="fas fa-globe-americas"></i>
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
            <i className="fas fa-user-circle"></i>
          </div>
          <span className="admin-user-name">Admin</span>
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
