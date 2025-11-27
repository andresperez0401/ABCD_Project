"use client"

import { useContext, useState, useEffect } from "react"
import { Context } from "../store/appContext"
import { FaMapMarkerAlt, FaClock, FaUsers, FaLanguage, FaArrowRight, FaGraduationCap } from "react-icons/fa"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import "../styles/CourseCards.css"
import CourseModal from "./CourseModal.jsx"
import { SkeletonCard } from "./Loader.jsx"

export default function CourseCards() {
  const { store, actions } = useContext(Context)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(2)
  const [isHovering, setIsHovering] = useState(false)
  const [localLoading, setLocalLoading] = useState(false)

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

    // Solo cargar si no hay cursos y no se están cargando globalmente
    if (store.cursos.length === 0 && !store.isLoading) {
      setLocalLoading(true)
      actions.getCursos().finally(() => setLocalLoading(false))
    }
    
    updateSlides()
    window.addEventListener("resize", updateSlides)
    return () => window.removeEventListener("resize", updateSlides)
  }, [])

  const goNext = () => {
    setCurrentIndex((prev) => {
      const last = Math.ceil(store.cursos.length / slidesToShow) - 1
      const next = prev >= last ? 0 : prev + 1
      // scroll to top smoothly when page of carousel changes
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
      return next
    })
  }

  const goPrev = () => {
    setCurrentIndex((prev) => {
      const last = Math.ceil(store.cursos.length / slidesToShow) - 1
      const next = prev === 0 ? last : prev - 1
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
      return next
    })
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewMore = (course) => {
    setSelectedCourse(course)
    setModalOpen(true)
  }

  const startIndex = currentIndex * slidesToShow
  const visibleCourses = store.cursos.slice(startIndex, startIndex + slidesToShow)

  // Mostrar skeleton loaders mientras carga
  if (localLoading || (store.cursos.length === 0 && store.isLoading)) {
    return (
      <div className="course-carousel-container">
        <div className="cards-wrapper">
          {[...Array(slidesToShow)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    )
  }

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
            <div 
              key={curso.idCurso} 
              className="card servicio-like"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => handleViewMore(curso)}
            >
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
                <h3 className="card-title-ux">{curso.nombre}</h3>
                <div className="card-destinations">
                  <FaMapMarkerAlt /> 
                  <span>
                    {curso.destinos && curso.destinos.length > 0 
                      ? curso.destinos.map(d => d.nombre).join(', ')
                      : 'Sin destino'}
                  </span>
                </div>
                <p className="card-desc-ux">{curso.descripcion}</p>

                <div className="card-info">
                  <div className="card-info-item">
                    <FaLanguage />
                    <span>
                      {curso.idiomas && curso.idiomas.length > 0
                        ? curso.idiomas.map(i => i.nombre).join(', ')
                        : 'N/A'}
                    </span>
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
                  {curso.servicios && curso.servicios.slice(0, 2).map((servicio) => (
                    <span key={servicio.idServicio} className="service-tag">
                      {servicio.nombre}
                    </span>
                  ))}
                  {curso.servicios && curso.servicios.length > 2 && (
                    <span className="service-more">+{curso.servicios.length - 2} más</span>
                  )}
                </div>

                <button
                  className="card-btn-ux"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewMore(curso)
                  }}
                >
                  <span>Ver detalles</span>
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
