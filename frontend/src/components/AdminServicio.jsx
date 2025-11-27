
import { useState, useEffect, useContext } from "react"
import { Context } from "../store/appContext"
import AdminNavbar from "./AdminNavbar"
import { toast } from "react-toastify"
import "../styles/AdminServicio.css"
import ModalServicio from "./ModalServicio"

const AdminServicio = () => {
  const { store, actions } = useContext(Context)
  const [servicios, setServicios] = useState([])
  const [selectedServicio, setSelectedServicio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", precio: "", imageUrl: "" })

  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true)
      await actions.getServicios()
      setLoading(false)
    }
    fetchServicios()
  }, [])

  useEffect(() => {
    setServicios(store.servicios)
  }, [store.servicios])

  const filteredServicios = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredServicios.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredServicios.length / itemsPerPage)

  const openCreateModal = () => {
    setFormData({ nombre: "", descripcion: "", precio: "", imageUrl: "" })
    setIsEditing(false)
    setShowModal(true)
  }

  const openEditModal = (servicio) => {
    setFormData({ ...servicio })
    setSelectedServicio(servicio)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (servicioData) => {
    if (isEditing) {
      const result = await actions.updateServicio(selectedServicio.idServicio, servicioData)
      if (result.success) toast.success("Servicio actualizado")
      else toast.error(result.message || "Error al actualizar servicio")
    } else {
      const result = await actions.createServicio(servicioData)
      if (result.success) toast.success("Servicio creado")
      else toast.error(result.message || "Error al crear servicio")
    }
    setShowModal(false)
    setSelectedServicio(null)
    await actions.getServicios()
  }

  const handleDelete = async (servicio) => {
    if (window.confirm(`¿Eliminar servicio "${servicio.nombre}"?`)) {
      const result = await actions.deleteServicio(servicio.idServicio)
      if (result.success) toast.success("Servicio eliminado")
      else toast.error(result.message || "Error al eliminar servicio")
      await actions.getServicios()
    }
  }

  return (
    <div className="admin-servicio-container">
      <AdminNavbar />
      <div className="admin-servicio-content">
        <div className="header-section">
          <h1>Administración de Servicios</h1>
          <div className="controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-primary" style={{display:'flex',alignItems:'center',gap:8}} onClick={openCreateModal}>
              <i className="fas fa-plus"></i> Nuevo Servicio
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando servicios...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="admin-servicio-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((servicio) => (
                        <tr key={servicio.idServicio} style={{cursor:'pointer'}} onClick={e => {
                          if (e.target.closest('.admin-actions')) return;
                          openEditModal(servicio);
                        }}>
                          <td>{servicio.idServicio}</td>
                          <td>{servicio.nombre}</td>
                          <td>{servicio.descripcion}</td>
                          <td>{servicio.precio || "—"}</td>
                          <td>{servicio.imageUrl ? <img src={servicio.imageUrl} alt="img" style={{width:40, borderRadius:8, boxShadow:'0 2px 8px #eee'}}/> : "—"}</td>
                          <td>
                            <div className="admin-actions">
                              <button className="btn-warning" title="Editar" onClick={e => {e.stopPropagation(); openEditModal(servicio);}}><i className="fas fa-edit"></i></button>
                              <button className="btn-danger" title="Eliminar" onClick={e => {e.stopPropagation(); handleDelete(servicio);}}><i className="fas fa-trash-alt"></i></button>
                            </div>
                          </td>
                        </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-results">
                        <i className="fas fa-exclamation-circle"></i> No se encontraron servicios
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredServicios.length > 0 && (
              <div className="pagination">
                <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
            {showModal && (
              <ModalServicio
                isEditing={isEditing}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                onClose={() => setShowModal(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminServicio
