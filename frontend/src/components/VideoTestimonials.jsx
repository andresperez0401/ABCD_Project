import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/VideoTestimonials.css";
import { useContext } from "react";
import{ Context } from "../store/appContext";

// const testimonials = [
//   {
//     name: "María Pérez",
//     videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
//     country: "España",
//     course: "Inglés Intensivo"
//   },
//   {
//     name: "Juan Sánchez",
//     videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
//     country: "Francia",
//     course: "Francés Avanzado"
//   },
//   {
//     name: "Luisa Gómez",
//     videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
//     country: "Alemania",
//     course: "Alemán para Negocios"
//   },
//   {
//     name: "Carlos Rodríguez",
//     videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
//     country: "Italia",
//     course: "Italiano Cultural"
//   },
// ];

const VideoTestimonials = () => {
  const { store, actions } = useContext(Context);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    actions.getTestimonios();
  }, []);

  const testimonials = store.testimonios;

  const goNext = () => {
    setCurrentIndex(prev => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const goPrev = () => {
    setCurrentIndex(prev => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Manejar gestos táctiles
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
  };

  return (
    <section className="video-section">
      <h2 className="video-title">Testimonios de nuestros estudiantes</h2>
      <p className="video-subtitle">Descubre experiencias reales de nuestros alumnos alrededor del mundo</p>
      
      <div 
        className="carousel-container"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button 
          className={`carousel-button prev ${isHovering ? 'visible' : ''}`} 
          onClick={goPrev}
          aria-label="Testimonio anterior"
        >
          <FiChevronLeft size={28} />
        </button>
        
        <div className="carousel-track">
          <div className="carousel-slides">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.idTestimonio} 
                className={`video-slide ${index === currentIndex ? 'active' : ''}`}
              >
                <div className="video-container">
                  <iframe
                    src={testimonial.videoUrl
                      .split('?')[0] // <-- ¡Esto corta el ?feature=shared!
                      .replace('https://youtu.be/', 'https://www.youtube.com/embed/')
                      .replace('watch?v=', 'embed/')}
                    title={`Testimonio de ${testimonial.nombre}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="testimonial-info">
                  <p className="testimonial-name">{testimonial.nombre}</p>
                  <p className="testimonial-meta">{testimonial.mensaje}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className={`carousel-button next ${isHovering ? 'visible' : ''}`} 
          onClick={goNext}
          aria-label="Siguiente testimonio"
        >
          <FiChevronRight size={28} />
        </button>
      </div>
      
      <div className="carousel-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir a testimonio ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default VideoTestimonials;