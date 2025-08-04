"use client"

import { useState, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import "../styles/Navbar.css"
import logo from "../images/abcd.jpg"

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [])

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/destinos", label: "Destinos" },
    { to: "/cursos", label: "Cursos" },
    { to: "/servicios", label: "Servicios" },
    { to: "/contacto", label: "Contacto" },
  ]

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-container">
        {/* Sección izquierda - Logo y título */}
        <div className="nav-left">
          <div className="nav-brand">
            <NavLink to="/" className="nav-logo-link">
              <img src={logo || "/placeholder.svg"} alt="ABCD Languages" className="nav-logo" />
            </NavLink>
            <span className="nav-title">ABCD Languages</span>
          </div>
        </div>

        {/* Sección central - Links de navegación */}
        <div className="nav-center">
          <nav className={`nav-menu ${open ? "open" : ""}`}>
            <ul className="nav-list">
              {navLinks.map((link) => (
                <li key={link.to} className="nav-item">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Sección derecha - Toggle button */}
        <div className="nav-right">
          <button
            className={`nav-toggle ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <span className="nav-toggle-line"></span>
            <span className="nav-toggle-line"></span>
            <span className="nav-toggle-line"></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
