"use client"

import { useState, useEffect, useContext } from "react"
import { Context } from "../store/appContext"
import AdminNavbar from "./AdminNavbar"
import { toast } from "react-toastify"
import "../styles/AdminClientes.css"

const AdminClientes = () => {
  const { store, actions } = useContext(Context)
  const [clientes, setClientes] = useState([])
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filterEstado, setFilterEstado] = useState("all")

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true)
      await actions.getClientes()
      setLoading(false)
    }

    fetchClientes()
  }, [])

  useEffect(() => {
    setClientes(store.clientes)
  }, [store.clientes])

  // Filtrar clientes basado en búsqueda y estado
  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm) ||
      (cliente.interes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.duracion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(cliente.edad || '').includes(searchTerm) ||
      (cliente.como_se_entero || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.como_se_entero_otro || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstado = filterEstado === "all" || cliente.estado === filterEstado

    return matchesSearch && matchesEstado
  })

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredClientes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage)

  const handleRowClick = (cliente) => {
    setSelectedCliente(cliente)
  }

  const closeDetail = () => {
    setSelectedCliente(null)
  }

  const handleEstadoChange = async (e, cliente) => {
    const newEstado = e.target.value

    // Actualizar en el backend
    const result = await actions.updateCliente(cliente.idCliente, { estado: newEstado })

    if (result.success) {
      // Actualización local
      setClientes((prev) => prev.map((c) => (c.idCliente === cliente.idCliente ? { ...c, estado: newEstado } : c)))

      if (selectedCliente?.idCliente === cliente.idCliente) {
        setSelectedCliente({ ...selectedCliente, estado: newEstado })
      }

      toast.success("Estado actualizado exitosamente")
    } else {
      console.error("Error al actualizar estado:", result.message)
      toast.error("Error al actualizar: " + result.message)
    }
  }

  const handleDeleteCliente = async (cliente) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar al cliente "${cliente.nombre}"? Esta acción no se puede deshacer.`,
      )
    ) {
      try {
        const result = await actions.deleteCliente(cliente.idCliente)
        if (result.success) {
          toast.success("Cliente eliminado exitosamente")
          // Cerrar el modal si el cliente eliminado estaba seleccionado
          if (selectedCliente?.idCliente === cliente.idCliente) {
            setSelectedCliente(null)
          }
        } else {
          toast.error(result.message || "Error al eliminar el cliente")
        }
      } catch (error) {
        toast.error("Error de conexión")
      }
    }
  }

  const renderEstadoBadge = (estado) => {
    const estados = {
      Registrado: "badge-blue",
      Contactado: "badge-yellow",
      Interesado: "badge-orange",
      Convertido: "badge-green",
      Perdido: "badge-red",
    }

    return <span className={`estado-badge ${estados[estado] || ""}`}>{estado}</span>
  }

  return (
    <div className="admin-container">
      <AdminNavbar />
      <div className="admin-content">
        <div className="header-section">
          <h1>Administración de Clientes</h1>
          <div className="controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-section">
              <label>Filtrar por estado:</label>
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="estado-filter">
                <option value="all">Todos</option>
                <option value="Registrado">Registrado</option>
                <option value="Contactado">Contactado</option>
                <option value="Interesado">Interesado</option>
                <option value="Convertido">Convertido</option>
                <option value="Perdido">Perdido</option>
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando clientes...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="clientes-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Interés</th>
                    <th>Duración</th>
                    <th>Edad</th>
                    <th>Origen</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((cliente) => (
                      <tr
                        key={cliente.idCliente}
                        onClick={() => handleRowClick(cliente)}
                        className={selectedCliente?.idCliente === cliente.idCliente ? "selected-row" : ""}
                      >
                        <td>{cliente.idCliente}</td>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.email}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.interes}</td>
                        <td>{cliente.duracion || '—'}</td>
                        <td>{cliente.edad ?? '—'}</td>
                        <td>
                          {cliente.como_se_entero === 'Otro' && cliente.como_se_entero_otro
                            ? `Otro: ${cliente.como_se_entero_otro}`
                            : (cliente.como_se_entero || '—')}
                        </td>
                        <td>
                          <select
                            value={cliente.estado}
                            onChange={(e) => handleEstadoChange(e, cliente)}
                            onClick={(e) => e.stopPropagation()}
                            className="estado-select"
                          >
                            <option value="Registrado">Registrado</option>
                            <option value="Contactado">Contactado</option>
                            <option value="Interesado">Interesado</option>
                            <option value="Convertido">Convertido</option>
                            <option value="Perdido">Perdido</option>
                          </select>
                          {renderEstadoBadge(cliente.estado)}
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button
                              className="admin-btn-delete"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteCliente(cliente)
                              }}
                              title="Eliminar cliente"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="no-results">
                        <i className="fas fa-exclamation-circle"></i> No se encontraron clientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredClientes.length > 0 && (
              <div className="pagination">
                <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span>
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
        {selectedCliente && (
          <div className="cliente-detail-overlay" onClick={closeDetail}>
            <div className="cliente-detail" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeDetail}>
                <i className="fas fa-times"></i>
              </button>
              <h2>Detalle del Cliente</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>ID:</label>
                  <span>{selectedCliente.idCliente}</span>
                </div>
                <div className="detail-item">
                  <label>Nombre:</label>
                  <span>{selectedCliente.nombre}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedCliente.email}</span>
                </div>
                <div className="detail-item">
                  <label>Teléfono:</label>
                  <span>{selectedCliente.telefono}</span>
                </div>
                <div className="detail-item">
                  <label>Interés:</label>
                  <span>{selectedCliente.interes}</span>
                </div>
                <div className="detail-item">
                  <label>Duración:</label>
                  <span>{selectedCliente.duracion || '—'}</span>
                </div>
                <div className="detail-item">
                  <label>Edad:</label>
                  <span>{selectedCliente.edad ?? '—'}</span>
                </div>
                <div className="detail-item">
                  <label>Origen:</label>
                  <span>
                    {selectedCliente.como_se_entero === 'Otro' && selectedCliente.como_se_entero_otro
                      ? `Otro: ${selectedCliente.como_se_entero_otro}`
                      : (selectedCliente.como_se_entero || '—')}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Estado:</label>
                  <div className="estado-container">
                    <select
                      value={selectedCliente.estado}
                      onChange={(e) => handleEstadoChange(e, selectedCliente)}
                      className="estado-select"
                    >
                      <option value="Registrado">Registrado</option>
                      <option value="Contactado">Contactado</option>
                      <option value="Interesado">Interesado</option>
                      <option value="Convertido">Convertido</option>
                      <option value="Perdido">Perdido</option>
                    </select>
                    {renderEstadoBadge(selectedCliente.estado)}
                  </div>
                </div>
                <div className="detail-item full-width">
                  <label>Fecha de Registro:</label>
                  <span>
                    {selectedCliente.fecha_registro
                      ? new Date(selectedCliente.fecha_registro).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="action-buttons">
                <button className="btn-primary">
                  <i className="fas fa-envelope"></i> Enviar Email
                </button>
                <button className="btn-secondary">
                  <i className="fas fa-phone"></i> Llamar
                </button>
                <button className="btn-warning">
                  <i className="fas fa-edit"></i> Editar
                </button>
                <button className="btn-danger" onClick={() => handleDeleteCliente(selectedCliente)}>
                  <i className="fas fa-trash-alt"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminClientes
