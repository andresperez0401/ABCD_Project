"use client"

import { useState, useEffect, useContext } from "react"
import { Context } from "../store/appContext"
import AdminNavbar from "./AdminNavbar"
import { toast } from "react-toastify"
import "../styles/AdminCursos.css"

const AdminCursos = () => {
  const { store, actions } = useContext(Context)
  const [cursos, setCursos] = useState([])
  const [selectedCurso, setSelectedCurso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    duracion: "",
    nivel: "",
    tipoCurso: "",
    edades: "",
    destino_id: "",
    idioma_id: "",
    servicios: [],
    imageUrl: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([actions.getCursos(), actions.getDestinos(), actions.getIdiomas(), actions.getServicios()])
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    setCursos(store.cursos)
  }, [store.cursos])

  // Filtrar cursos basado en búsqueda
  const filteredCursos = cursos.filter((curso) => {
    return (
      curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.duracion.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredCursos.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCursos.length / itemsPerPage)

  const openCreateModal = () => {
    setIsEditing(false)
    setFormData({
      nombre: "",
      descripcion: "",
      duracion: "",
      nivel: "",
      tipoCurso: "",
      edades: "",
      destino_id: "",
      idioma_id: "",
      servicios: [],
      imageUrl: "",
    })
    setPreviewUrl("")
    setImageFile(null)
    setShowModal(true)
  }

  const openEditModal = (curso) => {
    setIsEditing(true)
    setSelectedCurso(curso)
    setFormData({
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      duracion: curso.duracion,
      nivel: curso.nivel,
      tipoCurso: curso.tipoCurso,
      edades: curso.edades,
      destino_id: curso.destino_id,
      idioma_id: curso.idioma_id,
      servicios: curso.servicios.map((s) => s.idServicio),
      imageUrl: curso.imageUrl || "",
    })
    setPreviewUrl(curso.imageUrl || "")
    setImageFile(null)
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleServicioChange = (e) => {
    const servicioId = Number.parseInt(e.target.value)
    const isChecked = e.target.checked

    setFormData((prev) => {
      const servicios = isChecked ? [...prev.servicios, servicioId] : prev.servicios.filter((id) => id !== servicioId)
      return { ...prev, servicios }
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const uploadToCloudinary = async () => {
    if (!imageFile) return formData.imageUrl
    const formDataCloud = new FormData()
    formDataCloud.append("file", imageFile)
    formDataCloud.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

    try {
      setUploading(true)
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataCloud,
        },
      )

      const data = await response.json()
      setUploading(false)
      return data.secure_url
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploading(false)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Subir imagen si hay un archivo nuevo
    let imageUrl = formData.imageUrl
    if (imageFile) {
      const url = await uploadToCloudinary()
      if (url) imageUrl = url
    }

    const cursoData = {
      ...formData,
      imageUrl,
    }

    try {
      if (isEditing) {
        const result = await actions.updateCurso(selectedCurso.idCurso, cursoData)
        if (result.success) {
          toast.success("Curso actualizado exitosamente")
        } else {
          toast.error(result.message || "Error al actualizar el curso")
        }
      } else {
        const result = await actions.createCurso(cursoData)
        if (result.success) {
          toast.success("Curso creado exitosamente")
        } else {
          toast.error(result.message || "Error al crear el curso")
        }
      }
    } catch (error) {
      toast.error("Error de conexión")
    }

    setShowModal(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.")) {
      try {
        const result = await actions.deleteCurso(id)
        if (result.success) {
          toast.success("Curso eliminado exitosamente")
        } else {
          toast.error(result.message || "Error al eliminar el curso")
        }
      } catch (error) {
        toast.error("Error de conexión")
      }
    }
  }

  return (
    <div className="admin-cursos-container">
      <AdminNavbar />

      <div className="admin-cursos-content">
        <div className="admin-cursos-header">
          <div>
            <h1 className="admin-cursos-title">Gestión de Cursos</h1>
            <p className="admin-cursos-subtitle">Administra todos los cursos disponibles</p>
          </div>
          <button className="admin-btn-add" onClick={openCreateModal}>
            <i className="fas fa-plus"></i>
            <span>Nuevo Curso</span>
          </button>
        </div>

        <div className="admin-cursos-controls">
          <div className="admin-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="admin-results-info">
            {filteredCursos.length} curso{filteredCursos.length !== 1 ? "s" : ""} encontrado
            {filteredCursos.length !== 1 ? "s" : ""}
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-container">
            <div className="admin-spinner"></div>
            <p>Cargando cursos...</p>
          </div>
        ) : (
          <>
            {/* Vista de tabla para desktop y tablet */}
            <div className="admin-table-container desktop-table">
              <table className="admin-cursos-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Duración</th>
                    <th>Nivel</th>
                    <th>Tipo</th>
                    <th>Edades</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((curso) => (
                      <tr key={curso.idCurso}>
                        <td>
                          <span className="admin-id-badge">{curso.idCurso}</span>
                        </td>
                        <td>
                          <div className="admin-curso-info">
                            <span className="admin-curso-name">{curso.nombre}</span>
                            <span className="admin-curso-desc">{curso.descripcion.substring(0, 50)}...</span>
                          </div>
                        </td>
                        <td>{curso.duracion}</td>
                        <td>
                          <span className={`admin-nivel-badge admin-nivel-${curso.nivel.toLowerCase()}`}>
                            {curso.nivel}
                          </span>
                        </td>
                        <td>{curso.tipoCurso}</td>
                        <td>{curso.edades}</td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-btn-edit" onClick={() => openEditModal(curso)} title="Editar">
                              <i className="fas fa-pencil-alt"></i>
                            </button>
                            <button
                              className="admin-btn-delete"
                              onClick={() => handleDelete(curso.idCurso)}
                              title="Eliminar"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="admin-no-results">
                        <div className="admin-empty-state">
                          <i className="fas fa-search"></i>
                          <p>No se encontraron cursos</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Vista de cards para móvil */}
            <div className="admin-cards-container mobile-cards">
              {currentItems.length > 0 ? (
                currentItems.map((curso) => (
                  <div key={curso.idCurso} className="admin-curso-card">
                    <div className="admin-card-header">
                      <div className="admin-card-id">
                        <span className="admin-id-badge">{curso.idCurso}</span>
                      </div>
                      <div className="admin-card-actions">
                        <button className="admin-btn-edit" onClick={() => openEditModal(curso)} title="Editar">
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          className="admin-btn-delete"
                          onClick={() => handleDelete(curso.idCurso)}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>

                    <div className="admin-card-content">
                      <h3 className="admin-card-title">{curso.nombre}</h3>
                      <p className="admin-card-description">{curso.descripcion}</p>

                      <div className="admin-card-details">
                        <div className="admin-card-detail-item">
                          <span className="admin-detail-label">Duración:</span>
                          <span className="admin-detail-value">{curso.duracion}</span>
                        </div>

                        <div className="admin-card-detail-item">
                          <span className="admin-detail-label">Nivel:</span>
                          <span className={`admin-nivel-badge admin-nivel-${curso.nivel.toLowerCase()}`}>
                            {curso.nivel}
                          </span>
                        </div>

                        <div className="admin-card-detail-item">
                          <span className="admin-detail-label">Tipo:</span>
                          <span className="admin-detail-value">{curso.tipoCurso}</span>
                        </div>

                        <div className="admin-card-detail-item">
                          <span className="admin-detail-label">Edades:</span>
                          <span className="admin-detail-value">{curso.edades}</span>
                        </div>

                        {curso.destino && (
                          <div className="admin-card-detail-item">
                            <span className="admin-detail-label">Destino:</span>
                            <span className="admin-detail-value">{curso.destino.nombre}</span>
                          </div>
                        )}

                        {curso.idioma && (
                          <div className="admin-card-detail-item">
                            <span className="admin-detail-label">Idioma:</span>
                            <span className="admin-detail-value">{curso.idioma.nombre}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state-mobile">
                  <i className="fas fa-search"></i>
                  <p>No se encontraron cursos</p>
                </div>
              )}
            </div>

            {filteredCursos.length > 0 && totalPages > 1 && (
              <div className="admin-pagination">
                <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                  <i className="fas fa-chevron-left"></i>
                </button>

                <span className="admin-page-info">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal sencillo y funcional */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{isEditing ? "Editar Curso" : "Crear Nuevo Curso"}</h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-form">
              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-full">
                  <label>Nombre del Curso*</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingresa el nombre del curso"
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label>Descripción*</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Describe el curso..."
                  />
                </div>

                <div className="admin-form-group">
                  <label>Duración*</label>
                  <input
                    type="text"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: 4 semanas"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Nivel*</label>
                  <select name="nivel" value={formData.nivel} onChange={handleInputChange} required>
                    <option value="">Seleccionar nivel</option>
                    <option value="Principiante/Intermedio/Avanzado">Principiante/Intermedio/Avanzado</option>
                    <option value="Intermedio/Avanzado">Intermedio/Avanzado</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Tipo de Curso*</label>
                  <select name="tipoCurso" value={formData.tipoCurso} onChange={handleInputChange} required>
                    <option value="">Seleccionar tipo</option>
                    <option value="General">General</option>
                    <option value="Online">Online</option>
                    <option value="Campamento de Verano">Campamento De Verano</option>
                    <option value="Examenes de Cambridge">Examenes de Cambridge</option>
                    <option value="Estudio y Trabajo">Estudio y Trabajo</option>
                    <option value="+50">+50</option>
                    <option value="Negocios">Negocios</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Edades*</label>
                  <input
                    type="text"
                    name="edades"
                    value={formData.edades}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: 18-25 años"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Destino*</label>
                  <select name="destino_id" value={formData.destino_id} onChange={handleInputChange} required>
                    <option value="">Seleccionar destino</option>
                    {store.destinos.map((destino) => (
                      <option key={destino.idDestino} value={destino.idDestino}>
                        {destino.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Idioma*</label>
                  <select name="idioma_id" value={formData.idioma_id} onChange={handleInputChange} required>
                    <option value="">Seleccionar idioma</option>
                    {store.idiomas.map((idioma) => (
                      <option key={idioma.idIdioma} value={idioma.idIdioma}>
                        {idioma.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-section">
                <h3>Servicios Incluidos</h3>
                <div className="admin-servicios-grid">
                  {store.servicios.map((servicio) => (
                    <label key={servicio.idServicio} className="admin-servicio-checkbox">
                      <input
                        type="checkbox"
                        value={servicio.idServicio}
                        checked={formData.servicios.includes(servicio.idServicio)}
                        onChange={handleServicioChange}
                      />
                      <span>{servicio.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="admin-form-section">
                <h3>Imagen del Curso</h3>
                <div className="admin-image-uploader">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="admin-image-input"
                    id="curso-image"
                  />
                  <label htmlFor="curso-image" className="admin-upload-btn">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Seleccionar Imagen</span>
                  </label>
                  {previewUrl && (
                    <div className="admin-image-preview">
                      <img src={previewUrl || "/placeholder.svg"} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn-save" disabled={uploading}>
                  {uploading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <i className={`fas ${isEditing ? "fa-save" : "fa-plus"}`}></i>
                      <span>{isEditing ? "Actualizar" : "Crear Curso"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCursos
