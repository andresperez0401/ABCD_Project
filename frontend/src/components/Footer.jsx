import React from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiGlobe, FiMessageSquare, FiLock } from 'react-icons/fi';
import '../styles/Footer.css';
import canchaLogoSinFondo from "../images/abcd.jpg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo-container">
            <img src={canchaLogoSinFondo} alt="CanchaGO" />
          </div>
          <div>
            <h3>ABCD Languages</h3>
            <p>Transformando vidas a través de experiencias educativas internacionales desde 2010.</p>
          </div>
        </div>
        
        <div className="footer-links">
          <div className="link-group">
            <h4>Explorar</h4>
            <Link to="/cursos"><FiBook className="link-icon" /> Cursos</Link>
            <Link to="/destinos"><FiGlobe className="link-icon" /> Destinos</Link>
          </div>
          
          <div className="link-group">
            <h4>Empresa</h4>
            <Link to="/nosotros">Sobre nosotros</Link>
            <Link to="/contacto">Contacto</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2025 ABCD Languages. Todos los derechos reservados.</p>
        <Link to="/login" className="admin-login">
          <FiLock className="lock-icon" /> Acceso administrador
        </Link>
      </div>
    </footer>
  );
};

export default Footer;