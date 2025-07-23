"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import "../styles/Cursos.css"
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaLanguage,
  FaMapMarkerAlt,
  FaUserFriends,
  FaChartLine,
  FaClock,
  FaGraduationCap,
  FaWhatsapp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"
import Navbar from "./Navbar"
import Footer from "./Footer"

// Modal Component
const CourseModal = ({ course, isOpen, onClose }) => {
  if (!isOpen || !course) return null

  return (
    <div className="courses-modal-overlay" onClick={onClose}>
      <div className="courses-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="courses-modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="courses-modal-image">
          {course.imageUrl ? (
            <img src={course.imageUrl || "/placeholder.svg"} alt={course.nombre} />
          ) : (
            <div className="courses-modal-placeholder">
              <FaGraduationCap />
            </div>
          )}
        </div>

        <div className="courses-modal-body">
          <h2>{course.nombre}</h2>
          <p className="courses-modal-description">{course.descripcion}</p>

          <div className="courses-modal-details">
            <div className="courses-detail-item">
              <FaLanguage />
              <span>{course.idioma.nombre}</span>
            </div>
            <div className="courses-detail-item">
              <FaClock />
              <span>{course.duracion}</span>
            </div>
            <div className="courses-detail-item">
              <FaChartLine />
              <span>{course.nivel}</span>
            </div>
            <div className="courses-detail-item">
              <FaUserFriends />
              <span>{course.edades}</span>
            </div>
            <div className="courses-detail-item">
              <FaMapMarkerAlt />
              <span>{course.destino.nombre}</span>
            </div>
            <div className="courses-detail-item">
              <FaGraduationCap />
              <span>{course.tipoCurso}</span>
            </div>
          </div>

          <div className="courses-modal-services">
            <h3>Servicios incluidos</h3>
            <div className="courses-services-list">
              {course.servicios.map((servicio) => (
                <span key={servicio.idServicio} className="courses-service-tag">
                  {servicio.nombre}
                </span>
              ))}
            </div>
          </div>

          <button className="courses-whatsapp-btn" onClick={() => window.open(`https://wa.me/584142677943`, "_blank")}>
            <FaWhatsapp />
            Contactar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

const Cursos = () => {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 9

  const [filters, setFilters] = useState({
    search: "",
    idioma: "",
    tipoCurso: "",
    nivel: "",
    edad: "",
    destino: "",
  })

  // Fetch courses
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/curso`)
        if (!response.ok) throw new Error("Error al obtener cursos")
        const data = await response.json()
        setCursos(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCursos()
  }, [])

  // Filter options
  const filterOptions = useMemo(
    () => ({
      idiomas: ["", ...new Set(cursos.map((curso) => curso.idioma.nombre))],
      tiposCurso: ["", ...new Set(cursos.map((curso) => curso.tipoCurso))],
      niveles: ["", ...new Set(cursos.map((curso) => curso.nivel))],
      edades: ["", ...new Set(cursos.map((curso) => curso.edades))],
      destinos: ["", ...new Set(cursos.map((curso) => curso.destino.nombre))],
    }),
    [cursos],
  )

  // Filtered courses
  const filteredCursos = useMemo(() => {
    return cursos.filter((curso) => {
      const matchesSearch =
        !filters.search ||
        curso.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        curso.descripcion.toLowerCase().includes(filters.search.toLowerCase())

      return (
        matchesSearch &&
        (!filters.idioma || curso.idioma.nombre === filters.idioma) &&
        (!filters.tipoCurso || curso.tipoCurso === filters.tipoCurso) &&
        (!filters.nivel || curso.nivel === filters.nivel) &&
        (!filters.edad || curso.edades === filters.edad) &&
        (!filters.destino || curso.destino.nombre === filters.destino)
      )
    })
  }, [cursos, filters])

  // Paginación
  const totalPages = Math.ceil(filteredCursos.length / coursesPerPage)
  const startIndex = (currentPage - 1) * coursesPerPage
  const currentCursos = filteredCursos.slice(startIndex, startIndex + coursesPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      idioma: "",
      tipoCurso: "",
      nivel: "",
      edad: "",
      destino: "",
    })
  }, [])

  const openModal = useCallback((course) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedCourse(null)
    document.body.style.overflow = "unset"
  }, [])

  const renderFilter = (label, name, options, icon) => (
    <div className="courses-filter-item" key={name}>
      <label>
        {icon} {label}
      </label>
      <select value={filters[name]} onChange={(e) => handleFilterChange(name, e.target.value)}>
        <option value="">Todos</option>
        {options
          .filter((opt) => opt !== "")
          .map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
    </div>
  )

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="courses-pagination">
        <button
          className="courses-pagination-btn"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>

        {startPage > 1 && (
          <>
            <button className="courses-pagination-btn" onClick={() => setCurrentPage(1)}>
              1
            </button>
            {startPage > 2 && <span className="courses-pagination-dots">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            className={`courses-pagination-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="courses-pagination-dots">...</span>}
            <button className="courses-pagination-btn" onClick={() => setCurrentPage(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          className="courses-pagination-btn"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="courses-page">
        <Navbar />
        <div className="courses-loading">
          <div className="courses-spinner"></div>
          <p>Cargando cursos...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="courses-page">
        <Navbar />
        <div className="courses-error">
          <h3>Error al cargar los cursos</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="courses-page">
      <Navbar />

      {/* Hero Section - Estilo Destinos/Servicios */}
      <section className="courses-hero">
        <div className="courses-hero-content">
          <h1>Nuestros Cursos</h1>
          <p>Descubre programas únicos diseñados para transformar tu experiencia internacional</p>
        </div>
        <div className="courses-hero-overlay"></div>
      </section>

      <div className="courses-container">
        {/* Search */}
        <div className="courses-search-section">
          <div className="courses-search-box">
            <FaSearch className="courses-search-icon" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            {filters.search && (
              <button className="courses-clear-search" onClick={() => handleFilterChange("search", "")}>
                <FaTimes />
              </button>
            )}
          </div>

          <button className="courses-mobile-filter-btn" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
            <FaFilter /> Filtros
          </button>
        </div>

        <div className="courses-main">
          {/* Filters Sidebar */}
          <aside className={`courses-filters ${isMobileFiltersOpen ? "open" : ""}`}>
            <div className="courses-filters-header">
              <h3>Filtros</h3>
              <button className="courses-close-filters" onClick={() => setIsMobileFiltersOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="courses-filters-content">
              {renderFilter("Idioma", "idioma", filterOptions.idiomas, <FaLanguage />)}
              {renderFilter("Tipo", "tipoCurso", filterOptions.tiposCurso, <FaGraduationCap />)}
              {renderFilter("Nivel", "nivel", filterOptions.niveles, <FaChartLine />)}
              {renderFilter("Edad", "edad", filterOptions.edades, <FaUserFriends />)}
              {renderFilter("Destino", "destino", filterOptions.destinos, <FaMapMarkerAlt />)}

              <button className="courses-reset-btn" onClick={resetFilters}>
                Limpiar filtros
              </button>
            </div>
          </aside>

          {/* Content */}
          <main className="courses-content">
            {/* Applied Filters */}
            {Object.values(filters).some((val) => val !== "") && (
              <div className="courses-applied-filters">
                {Object.entries(filters).map(([key, value]) => {
                  if (value && key !== "search") {
                    return (
                      <span key={key} className="courses-applied-filter">
                        {value}
                        <button onClick={() => handleFilterChange(key, "")}>
                          <FaTimes />
                        </button>
                      </span>
                    )
                  }
                  return null
                })}
                <button className="courses-clear-all" onClick={resetFilters}>
                  Limpiar todos
                </button>
              </div>
            )}

            {/* Results */}
            <div className="courses-results-header">
              <h2>
                {filteredCursos.length > 0
                  ? `${filteredCursos.length} ${filteredCursos.length === 1 ? "curso" : "cursos"} encontrados`
                  : "No se encontraron cursos"}
              </h2>
              {totalPages > 1 && (
                <p className="courses-pagination-info">
                  Página {currentPage} de {totalPages} - Mostrando {startIndex + 1} a{" "}
                  {Math.min(startIndex + coursesPerPage, filteredCursos.length)} de {filteredCursos.length} cursos
                </p>
              )}
            </div>

            {/* Courses Grid */}
            <div className="courses-grid">
              {currentCursos.length > 0 ? (
                currentCursos.map((curso) => (
                  <div key={curso.idCurso} className="courses-card" onClick={() => openModal(curso)}>
                    <div className="courses-card-image">
                      {curso.imageUrl ? (
                        <img src={curso.imageUrl || "/placeholder.svg"} alt={curso.nombre} />
                      ) : (
                        <div className="courses-card-placeholder">
                          <FaGraduationCap />
                        </div>
                      )}
                    </div>

                    <div className="courses-card-content">
                      <h3>{curso.nombre}</h3>
                      <p>{curso.descripcion}</p>

                      <div className="courses-card-meta">
                        <span>
                          <FaLanguage /> {curso.idioma.nombre}
                        </span>
                        <span>
                          <FaClock /> {curso.duracion}
                        </span>
                        <span>
                          <FaMapMarkerAlt /> {curso.destino.nombre}
                        </span>
                      </div>

                      <div className="courses-card-services">
                        {curso.servicios.slice(0, 3).map((servicio) => (
                          <span key={servicio.idServicio} className="courses-service-tag">
                            {servicio.nombre}
                          </span>
                        ))}
                        {curso.servicios.length > 3 && (
                          <span className="courses-more-services">+{curso.servicios.length - 3} más</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="courses-no-results">
                  <FaSearch />
                  <h3>No encontramos cursos</h3>
                  <p>Intenta ajustar tus filtros</p>
                  <button onClick={resetFilters}>Ver todos los cursos</button>
                </div>
              )}
            </div>

            {/* Paginación */}
            {renderPagination()}
          </main>
        </div>

        {/* CTA Section - Estilo Destinos/Servicios */}
        <section className="courses-cta">
          <div className="courses-cta-content">
            <h2>¿Listo para tu próxima aventura?</h2>
            <p>Descubre cómo podemos ayudarte a encontrar el programa perfecto para aprender idiomas</p>
            <button className="courses-cta-button" onClick={() => window.open(`https://wa.me/584142677943`, "_blank")}>
              Contáctanos <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </section>
      </div>

      <CourseModal course={selectedCourse} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default Cursos
