import React, { useState, useEffect, useContext } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ReactPlayer from "react-player"; // npm i react-player si no tienes
import "../styles/VideoTestimonials.css";
import { Context } from "../store/appContext";

const VideoTestimonials = () => {
  const { store, actions } = useContext(Context);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    // actions.getTestimonios();
  }, []);

  const testimonials = store.testimoniosData || [];

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

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
  };

  const getYoutubeUrl = (url) => {
    if (!url) return "";

    // Si es youtu.be
    if (url.includes("youtu.be")) {
      // Divide en "/" y toma el último trozo, luego corta todo lo que venga después de "?"
      const id = url.split("/").pop().split("?")[0];
      return `https://www.youtube.com/watch?v=${id}`;
    }

    // Si es youtube.com/watch
    if (url.includes("youtube.com/watch")) {
      try {
        const urlObj = new URL(url);
        const id = urlObj.searchParams.get("v");
        return id ? `https://www.youtube.com/watch?v=${id}` : url;
      } catch (e) {
        // Si la URL está mal, devolvemos el original
        return url;
      }
    }

    // Para cualquier otro tipo de URL
    return url;
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
          className={`carousel-button prev ${isHovering ? "visible" : ""}`}
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
                className={`video-slide ${index === currentIndex ? "active" : ""}`}
              >
                <div className="video-container">
                  <ReactPlayer
                    url={getYoutubeUrl(testimonial.videoUrl)}
                    width="100%"
                    height="100%"
                    controls
                    playing={index === currentIndex}
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
          className={`carousel-button next ${isHovering ? "visible" : ""}`}
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
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir a testimonio ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default VideoTestimonials;
