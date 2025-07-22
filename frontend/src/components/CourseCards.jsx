import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext"; 
import { FaMapMarkerAlt, FaClock, FaUsers, FaLanguage, FaCouch } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/CourseCards.css";
import CourseModal from "./CourseModal.jsx";

export default function CourseCards() {
  const { store, actions } = useContext(Context);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(2); // Por defecto 2 en desktop
  const [isHovering, setIsHovering] = useState(false);

  // Calcular slides a mostrar según tamaño de pantalla
  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1); // 1 en móviles
      } else if (window.innerWidth < 1200) {
        setSlidesToShow(2); // 2 en tablets
      } else {
        setSlidesToShow(3); // 3 en desktop grande
      }
    };

    let response = actions.getCursos(); // Cargar cursos al iniciar

    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  const goNext = () => {
    setCurrentIndex(prev => 
      prev >= Math.ceil(store.cursos.length / slidesToShow) - 1 ? 0 : prev + 1
    );
  };

  const goPrev = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.ceil(store.cursos.length / slidesToShow) - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleViewMore = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  // Calcular qué cursos mostrar
  const startIndex = currentIndex * slidesToShow;
  const visibleCourses = store.cursos.slice(startIndex, startIndex + slidesToShow);

  return (
    <>
      <div 
        className="course-carousel-container"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <button 
          className={`carousel-button prev ${isHovering ? 'visible' : ''}`} 
          onClick={goPrev}
          aria-label="Cursos anteriores"
        >
          <FiChevronLeft size={24} />
        </button>
        
        <div className="cards-wrapper">
          {visibleCourses.map((curso, idx) => (
            <div
              key={curso.idCurso}
              className="card"
            >
              <div
                className="card-image"
                style={{ backgroundImage: `url(${curso.imageUrl})` }}
              />
              <div className="card-content">
                <h3>{curso.nombre}</h3>
                <p className="card-desc">{curso.descripcion}</p>
                <ul className="card-info">
                  <li><FaMapMarkerAlt /> {curso.destino.nombre}</li>
                  <li><FaUsers /> {curso.edades}</li>
                  <li><FaClock /> {curso.duracion}</li>
                  {/* <li><FaCouch /> {curso.servicios}</li> */}
                  <li><FaLanguage /> {curso.idioma.nombre}</li>
                </ul>
                <button className="card-btn" onClick={() => handleViewMore(curso)}>
                  Ver más
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className={`carousel-button next ${isHovering ? 'visible' : ''}`} 
          onClick={goNext}
          aria-label="Siguientes cursos"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
      
      <div className="carousel-dots">
        {Array.from({ length: Math.ceil(store.cursos.length / slidesToShow) }).map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a página ${index + 1}`}
          />
        ))}
      </div>

      <CourseModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        course={selectedCourse}
      />
    </>
  );
}