import React from "react";
import Navbar from "./Navbar";
import GloboCursos from "./GloboCursos";
import CourseCards from "./CourseCards";
import "../styles/StartPage.css";
import StatsBar from "./StatsBar";              
import VideoTestimonials from "./VideoTestimonials";

const StartPage = () => (
  <div className="start-page">
    <Navbar />

    {/* Sección principal con texto + globo */}
    <section className="globe-section">
      <div className="globe-text">
        <h1 style={{ fontFamily: '"Roboto", sans-serif' }}>
          Aprende el idioma de tu elección en los mejores destinos
          internacionales.
        </h1>
        <p>
          Explora los países resaltados.{" "}
          <strong>Gira el globo y haz clic para conocer nuestros cursos.</strong>
        </p>
      </div>
      <div className="globo-container">
        <GloboCursos />
      </div>
    </section>

    {/* Métricas animadas */}
    <StatsBar />    

    {/* Sección independiente de cartas */}
    <section className="courses-section">
      <h2 className="section-title">Nuestros Cursos Destacados</h2>
      <CourseCards />
    </section>

    {/* Testimonios en video */}
    <VideoTestimonials />       

    {/* Más secciones abajo… */}
    <section className="more-info">{/* … */}</section>
  </div>
);

export default StartPage;
