import React from 'react';
import Navbar from './Navbar';
import GloboCursos from './GloboCursos';
import '../styles/StartPage.css';

const StartPage = () => (
  <div className="start-page">
    <Navbar />

    <div className="globe-section">
      <div className="globe-text">
        <h1>Bienvenido a ABCD Languages</h1>
        <p>
          Aprende idiomas con la mejor plataforma. 
          Explora nuestros cursos en todo el mundo haciendo click en un país.
        </p>
        <ul>
          <li>Inglés en UK</li>
          <li>Español en Spain</li>
          <li>Japonés en Japan</li>
          <li>Portugués en Brazil</li>
        </ul>
      </div>
      <div className="globo-container">
        <GloboCursos />
      </div>
    </div>
  </div>
);

export default StartPage;
