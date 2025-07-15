// src/components/VideoTestimonials.jsx
import React from "react";
import "../styles/VideoTestimonials.css";

const testimonials = [
  {
    name: "María Pérez",
    videoUrl: "https://www.youtube.com/embed/0WtdfL2a7dY", // Video funcional
    country: "España",
    course: "Inglés Intensivo"
  },
  {
    name: "Juan Sánchez",
    videoUrl: "https://www.youtube.com/embed/0WtdfL2a7dY",
    country: "Francia",
    course: "Francés Avanzado"
  },
  {
    name: "Luisa Gómez",
    videoUrl: "https://www.youtube.com/embed/0WtdfL2a7dY",
    country: "Alemania",
    course: "Alemán para Negocios"
  },
  // Agregar más según sea necesario
];

const VideoTestimonials = () => (
  <section className="video-section">
    <h2 className="video-title">Testimonios de nuestros estudiantes</h2>
    
    <div className="video-grid">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="video-card">
          <div className="video-wrapper">
            <iframe
              src={testimonial.videoUrl}
              title={`Testimonio de ${testimonial.name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="video-info">
            <p className="video-name">{testimonial.name}</p>
            <p className="video-meta">
              {testimonial.country} • {testimonial.course}
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default VideoTestimonials;