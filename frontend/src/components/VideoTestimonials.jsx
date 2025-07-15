// src/components/VideoTestimonials.jsx
import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/VideoTestimonials.css";

// URLs de videos funcionales
const testimonials = [
  {
    name: "María Pérez",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    country: "España",
    course: "Inglés Intensivo"
  },
  {
    name: "Juan Sánchez",
    videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    country: "Francia",
    course: "Francés Avanzado"
  },
  {
    name: "Luisa Gómez",
    videoUrl: "https://www.youtube.com/embed/oHg5SJYRHA0",
    country: "Alemania",
    course: "Alemán para Negocios"
  },
  {
    name: "Carlos Rodríguez",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    country: "Italia",
    course: "Italiano Cultural"
  },
];

const VideoTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Calcular cuántos slides mostrar según el tamaño de pantalla
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 576) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 992) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  const goNext = () => {
    setCurrentIndex(prev => 
      prev >= testimonials.length - slidesToShow ? 0 : prev + 1
    );
  };

  const goPrev = () => {
    setCurrentIndex(prev => 
      prev === 0 ? testimonials.length - slidesToShow : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Manejar gestos táctiles
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Deslizar izquierda
      goNext();
    } else if (touchEnd - touchStart > 50) {
      // Deslizar derecha
      goPrev();
    }
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
        onTouchMove={handleTouchMove}
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
          <div 
            className="carousel-slides" 
            style={{ 
              transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
              width: `${testimonials.length * (100 / slidesToShow)}%`
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="video-slide"
                style={{ width: `${100 / slidesToShow}%` }}
              >
                <div className="video-container">
                  <iframe
                    src={testimonial.videoUrl}
                    title={`Testimonio de ${testimonial.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="testimonial-info">
                  <p className="testimonial-name">{testimonial.name}</p>
                  <p className="testimonial-meta">{testimonial.country} • {testimonial.course}</p>
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
        {Array.from({ length: testimonials.length - slidesToShow + 1 }).map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a testimonio ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default VideoTestimonials;