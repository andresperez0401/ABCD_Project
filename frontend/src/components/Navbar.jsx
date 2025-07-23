import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from "../images/abcd.jpg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, []);

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/servicios', label: 'Servicios' },
    { to: '/cursos', label: 'Cursos' },
    { to: '/destinos', label: 'Destinos' },
    { to: '/contacto', label: 'Contacto' }
  ];

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/" className="nav-logo-link">
            <img src={logo} alt="ABCD Languages" className="nav-logo" />
          </NavLink>
          <span className="nav-title">ABCD Languages</span> {/* 🔥 EL TÍTULO AQUÍ */}
        </div>

        <button 
          className={`nav-toggle ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span className="nav-toggle-line"></span>
          <span className="nav-toggle-line"></span>
          <span className="nav-toggle-line"></span>
        </button>

        <nav className={`nav-menu ${open ? 'open' : ''}`}>
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.to} className="nav-item">
                <NavLink 
                  to={link.to} 
                  className={({isActive}) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
