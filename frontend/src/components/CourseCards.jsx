"use client"

import { useContext, useState, useEffect } from "react"
import { Context } from "../store/appContext"
import { FaMapMarkerAlt, FaClock, FaUsers, FaLanguage, FaArrowRight, FaGraduationCap } from "react-icons/fa"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import "../styles/CourseCards.css"
import CourseModal from "./CourseModal.jsx"

export default function CourseCards() {
  const { store, actions } = useContext(Context)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(2)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1)
      } else if (window.innerWidth < 1200) {
        setSlidesToShow(2)
      } else {
        setSlidesToShow(3)
      }
    }

    const response = actions.getCursos()
    updateSlides()
    window.addEventListener("resize", updateSlides)
    return () => window.removeEventListener("resize", updateSlides)
  }, [])

  const goNext = () => {
    setCurrentIndex((prev) => (prev >= Math.ceil(store.cursos.length / slidesToShow) - 1 ? 0 : prev + 1))
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.ceil(store.cursos.length / slidesToShow) - 1 : prev - 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const handleViewMore = (course) => {
    setSelectedCourse(course)
    setModalOpen(true)
  }

  const startIndex = currentIndex * slidesToShow
  const visibleCourses = store.cursos.slice(startIndex, startIndex + slidesToShow)

  return (
    <>
      <div
        className="course-carousel-container"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <button
          className={`carousel-button prev ${isHovering ? "visible" : ""}`}
          onClick={goPrev}
          aria-label="Cursos anteriores"
        >
          <FiChevronLeft size={24} />
        </button>

        <div className="cards-wrapper">
          {visibleCourses.map((curso, idx) => (
            <div key={curso.idCurso} className="card" onClick={() => handleViewMore(curso)}>
              <div className="card-image-container">
                {curso.imageUrl ? (
                  <div className="card-image" style={{ backgroundImage: `url(${curso.imageUrl})` }} />
                ) : (
                  <div className="card-image-placeholder">
                    <FaGraduationCap />
                  </div>
                )}
                <div className="card-overlay">
                  <div className="card-badge">
                    <FaArrowRight />
                  </div>
                </div>
              </div>

              <div className="card-content">
                <h3>{curso.nombre}</h3>
                <p className="card-location">
                  <FaMapMarkerAlt /> {curso.destino.nombre}
                </p>
                <p className="card-desc">{curso.descripcion}</p>

                <div className="card-info">
                  <div className="card-info-item">
                    <FaLanguage />
                    <span>{curso.idioma.nombre}</span>
                  </div>
                  <div className="card-info-item">
                    <FaClock />
                    <span>{curso.duracion}</span>
                  </div>
                  <div className="card-info-item">
                    <FaUsers />
                    <span>{curso.edades}</span>
                  </div>
                </div>

                <div className="card-services">
                  {curso.servicios.slice(0, 2).map((servicio) => (
                    <span key={servicio.idServicio} className="service-tag">
                      {servicio.nombre}
                    </span>
                  ))}
                  {curso.servicios.length > 2 && (
                    <span className="service-more">+{curso.servicios.length - 2} más</span>
                  )}
                </div>

                <button
                  className="card-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewMore(curso)
                  }}
                >
                  Ver detalles
                  <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className={`carousel-button next ${isHovering ? "visible" : ""}`}
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
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a página ${index + 1}`}
          />
        ))}
      </div>

      <CourseModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} course={selectedCourse} />
    </>
  )
}
