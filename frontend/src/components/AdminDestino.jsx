import { useState, useEffect, useContext } from "react"
import { Context } from "../store/appContext"
import AdminNavbar from "./AdminNavbar"
import { toast } from "react-toastify"
import "../styles/AdminDestino.css"
import ModalDestino from "./ModalDestino"

const AdminDestino = () => {
  const { store, actions } = useContext(Context)
  const [destinos, setDestinos] = useState([])
  const [selectedDestino, setSelectedDestino] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", ubicacion: "", imageUrl: "" })

  useEffect(() => {
    const fetchDestinos = async () => {
      setLoading(true)
      await actions.getDestinos()
      setLoading(false)
    }
    fetchDestinos()
  }, [])

  useEffect(() => {
    setDestinos(store.destinos)
  }, [store.destinos])

  const filteredDestinos = destinos.filter((destino) =>
    destino.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destino.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDestinos.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredDestinos.length / itemsPerPage)

  const openCreateModal = () => {
    setFormData({ nombre: "", descripcion: "", ubicacion: "", imageUrl: "" })
    setIsEditing(false)
    setShowModal(true)
  }

  const openEditModal = (destino) => {
    setFormData({ ...destino })
    setSelectedDestino(destino)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (destinoData) => {
    if (isEditing) {
      const result = await actions.updateDestino(selectedDestino.idDestino, destinoData)
      if (result.success) toast.success("Destino actualizado")
      else toast.error(result.message || "Error al actualizar destino")
    } else {
      const result = await actions.createDestino(destinoData)
      if (result.success) toast.success("Destino creado")
      else toast.error(result.message || "Error al crear destino")
    }
    setShowModal(false)
    setSelectedDestino(null)
    await actions.getDestinos()
  }

  const handleDelete = async (destino) => {
    if (window.confirm(`¿Eliminar destino "${destino.nombre}"?`)) {
      const result = await actions.deleteDestino(destino.idDestino)
      if (result.success) toast.success("Destino eliminado")
      else toast.error(result.message || "Error al eliminar destino")
      await actions.getDestinos()
    }
  }

  return (
    <div className="admin-destino-container">
      <AdminNavbar />
      <div className="admin-destino-content">
        <div className="header-section">
          <h1>Administración de Destinos</h1>
          <div className="controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar destinos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-primary" style={{display:'flex',alignItems:'center',gap:8}} onClick={openCreateModal}>
              <i className="fas fa-plus"></i> Nuevo Destino
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando destinos...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="admin-destino-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Ubicación</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((destino) => (
                      <tr
                        key={destino.idDestino}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          const target = e.target
                          if (target && target.closest && target.closest(".admin-actions")) return
                          openEditModal(destino)
                        }}
                      >
                        <td>{destino.idDestino}</td>
                        <td>{destino.nombre}</td>
                        <td>{destino.descripcion}</td>
                        <td>{destino.ubicacion}</td>
                        <td>{destino.imageUrl ? <img src={destino.imageUrl} alt="img" style={{width:40, borderRadius:8, boxShadow:'0 2px 8px #eee'}}/> : "—"}</td>
                        <td>
                          <div className="admin-actions">
                            <button className="btn-warning" title="Editar" onClick={e => {e.stopPropagation(); openEditModal(destino);}}><i className="fas fa-edit"></i></button>
                            <button className="btn-danger" title="Eliminar" onClick={e => {e.stopPropagation(); handleDelete(destino);}}><i className="fas fa-trash-alt"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-results">
                        <i className="fas fa-exclamation-circle"></i> No se encontraron destinos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredDestinos.length > 0 && (
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
              <ModalDestino
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

export default AdminDestino

// ...existing code...
