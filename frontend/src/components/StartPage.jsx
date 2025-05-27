import React from "react";
import Navbar from "./Navbar";
import GloboCursos from "./GloboCursos";
import CourseCards from "./CourseCards";
import "../styles/StartPage.css";

const StartPage = () => (
  <div className="start-page">
    <Navbar />

    {/* Sección principal con texto + globo */}
    <section className="globe-section">
      <div className="globe-text">
        <h1 style={{ fontFamily: '"Trebuchet MS", sans-serif' }}>
          Bienvenido a ABCD Languages
        </h1>
        <p>
          Aprende el idioma de tu elección en los mejores destinos
          internacionales.
        </p>
        <p>
          Explora los países resaltados.{" "}
          <strong>Gira el globo y haz clic para conocer nuestros cursos.</strong>
        </p>
      </div>
      <div className="globo-container">
        <GloboCursos />
      </div>
    </section>

    {/* Sección independiente de cartas */}
    <section className="courses-section">
      <h2 className="section-title">Nuestros Cursos Destacados</h2>
      <CourseCards />
    </section>

    {/* Más secciones abajo… */}
    <section className="more-info">{/* … */}</section>
  </div>
);

export default StartPage;
