
import { useState, useEffect, useContext } from "react"
import { Context } from "../store/appContext"
import AdminNavbar from "./AdminNavbar"
import { toast } from "react-toastify"
import "../styles/AdminIdioma.css"
import ModalIdioma from "./ModalIdioma"

const AdminIdioma = () => {
  const { store, actions } = useContext(Context)
  const [idiomas, setIdiomas] = useState([])
  const [selectedIdioma, setSelectedIdioma] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", imageUrl: "" })

  useEffect(() => {
    const fetchIdiomas = async () => {
      setLoading(true)
      await actions.getIdiomas()
      setLoading(false)
    }
    fetchIdiomas()
  }, [])

  useEffect(() => {
    setIdiomas(store.idiomas)
  }, [store.idiomas])

  const filteredIdiomas = idiomas.filter((idioma) =>
    idioma.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idioma.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredIdiomas.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredIdiomas.length / itemsPerPage)

  const openCreateModal = () => {
    setFormData({ nombre: "", descripcion: "", imageUrl: "" })
    setIsEditing(false)
    setShowModal(true)
  }

  const openEditModal = (idioma) => {
    setFormData({ ...idioma })
    setSelectedIdioma(idioma)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (idiomaData) => {
    if (isEditing) {
      const result = await actions.updateIdioma(selectedIdioma.idIdioma, idiomaData)
      if (result.success) toast.success("Idioma actualizado")
      else toast.error(result.message || "Error al actualizar idioma")
    } else {
      const result = await actions.createIdioma(idiomaData)
      if (result.success) toast.success("Idioma creado")
      else toast.error(result.message || "Error al crear idioma")
    }
    setShowModal(false)
    setSelectedIdioma(null)
    await actions.getIdiomas()
  }

  const handleDelete = async (idioma) => {
    if (window.confirm(`¿Eliminar idioma "${idioma.nombre}"?`)) {
      const result = await actions.deleteIdioma(idioma.idIdioma)
      if (result.success) toast.success("Idioma eliminado")
      else toast.error(result.message || "Error al eliminar idioma")
      await actions.getIdiomas()
    }
  }

  return (
    <div className="admin-idioma-container">
      <AdminNavbar />
      <div className="admin-idioma-content">
        <div className="header-section">
          <h1>Administración de Idiomas</h1>
          <div className="controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar idiomas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-primary" style={{display:'flex',alignItems:'center',gap:8}} onClick={openCreateModal}>
              <i className="fas fa-plus"></i> Nuevo Idioma
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando idiomas...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="admin-idioma-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((idioma) => (
                      <tr
                        key={idioma.idIdioma}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          const target = e.target
                          if (target && target.closest && target.closest(".admin-actions")) return
                          openEditModal(idioma)
                        }}
                      >
                        <td>{idioma.idIdioma}</td>
                        <td>{idioma.nombre}</td>
                        <td>{idioma.descripcion}</td>
                        <td>{idioma.imageUrl ? <img src={idioma.imageUrl} alt="img" style={{width:40, borderRadius:8, boxShadow:'0 2px 8px #eee'}}/> : "—"}</td>
                        <td>
                          <div className="admin-actions">
                            <button className="btn-warning" title="Editar" onClick={e => {e.stopPropagation(); openEditModal(idioma);}}><i className="fas fa-edit"></i></button>
                            <button className="btn-danger" title="Eliminar" onClick={e => {e.stopPropagation(); handleDelete(idioma);}}><i className="fas fa-trash-alt"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-results">
                        <i className="fas fa-exclamation-circle"></i> No se encontraron idiomas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredIdiomas.length > 0 && (
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
              <ModalIdioma
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

export default AdminIdioma
