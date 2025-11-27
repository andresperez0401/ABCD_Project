
import React, { useRef, useEffect, useState } from "react"

const ModalServicio = ({ isEditing, formData, handleInputChange, handleSubmit, onClose }) => {
  const modalRef = useRef(null)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(formData.imageUrl || "")
  const [removeImage, setRemoveImage] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (modalRef.current) {
      const input = modalRef.current.querySelector("input")
      if (input) input.focus()
    }
  }, [])


  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setRemoveImage(false)
    }
  }

  const uploadToCloudinary = async () => {
    if (!imageFile) return formData.imageUrl
    setUploading(true)
    const formDataCloud = new FormData()
    formDataCloud.append("file", imageFile)
    formDataCloud.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formDataCloud
      })
      const data = await res.json()
      setUploading(false)
      return data.secure_url
    } catch (err) {
      setUploading(false)
      return null
    }
  }


  const handleRemoveImage = () => {
    setImageFile(null)
    setPreviewUrl("")
    setRemoveImage(true)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    let imageUrl = formData.imageUrl
    if (removeImage) {
      imageUrl = ""
    } else if (imageFile) {
      const url = await uploadToCloudinary()
      if (url) imageUrl = url
    }
    handleSubmit({ ...formData, imageUrl })
  }

  return (
    <div className="admin-modal-overlay" tabIndex={-1} onClick={e => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div className="admin-modal-content" ref={modalRef} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="admin-modal-header">
          <h2>{isEditing ? "Editar Servicio" : "Nuevo Servicio"}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Cerrar">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="admin-modal-form">
          <div className="admin-form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required placeholder="Ej: Traducción" />
          </div>
          <div className="admin-form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <input id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleInputChange} required placeholder="Ej: Traducción de documentos..." />
          </div>
          <div className="admin-form-group">
            <label htmlFor="precio">Precio:</label>
            <input id="precio" name="precio" value={formData.precio} onChange={handleInputChange} placeholder="Ej: 100" />
          </div>
          <div className="admin-form-section">
            <h3>Imagen del Servicio</h3>
            <div className="admin-image-uploader">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="admin-image-input"
                id="servicio-image"
              />
              <label htmlFor="servicio-image" className="admin-upload-btn">
                <i className="fas fa-cloud-upload-alt"></i>
                <span>Seleccionar Imagen</span>
              </label>
              {previewUrl && (
                <div className="admin-image-preview">
                  <img src={previewUrl || "/placeholder.svg"} alt="Preview" />
                  <button type="button" className="admin-btn-cancel" style={{marginTop:8}} onClick={handleRemoveImage}>Eliminar Imagen</button>
                </div>
              )}
              {!previewUrl && formData.imageUrl && !removeImage && (
                <div className="admin-image-preview">
                  <img src={formData.imageUrl} alt="Preview" />
                  <button type="button" className="admin-btn-cancel" style={{marginTop:8}} onClick={handleRemoveImage}>Eliminar Imagen</button>
                </div>
              )}
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn-save" disabled={uploading}>
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <i className={`fas ${isEditing ? "fa-save" : "fa-plus"}`}></i>
                  <span>{isEditing ? "Actualizar" : "Crear Servicio"}</span>
                </>
              )}
            </button>
            <button type="button" className="admin-btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalServicio
