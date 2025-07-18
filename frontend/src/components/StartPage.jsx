import React from "react";
import Navbar from "./Navbar";
import GloboCursos from "./GloboCursos";
import CourseCards from "./CourseCards";
import "../styles/StartPage.css";
import StatsBar from "./StatsBar";              
import VideoTestimonials from "./VideoTestimonials";
import ContactForm from "./ContactForm";
import Footer from "./Footer"; // Nuevo footer

const StartPage = () => {

  const handleFormSubmit = (data) => {
    // 1. Guardar en el estado de Flux
    // dispatch(saveContactData(data));
    
    // 2. Enviar a tu backend
    console.log("Datos para backend:", data);
  };

  return (
  <div className="start-page">
    <Navbar />

    {/* Sección principal con texto + globo */}
    <section className="globe-section">
      <div className="globe-text">
        <h1 style={{ fontFamily: '"Roboto", sans-serif' }}>
          Aprende idiomas en los mejores destinos
          internacionales
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

    {/* Sección de formulario de contacto */}
    <section className="contact-section">
        <h2>¿Listo para comenzar tu aventura?</h2>
        <p className="contact-subtitle">Déjanos tus datos y te contactaremos con las mejores opciones</p>
        <ContactForm onSubmit={handleFormSubmit} />
    </section>
  </div>
);
}

export default StartPage;