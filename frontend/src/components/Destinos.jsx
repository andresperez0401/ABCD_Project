import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext.jsx';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/Destinos.css';

const Destinos = () => {
  const { store, actions } = useContext(Context);
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredDestinos, setFilteredDestinos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('todos');
  const navigate = useNavigate();

  // Regiones disponibles
  const regions = [
    { id: 'todos', name: 'Todos los Destinos' },
    { id: 'europa', name: 'Europa' },
    { id: 'america', name: 'América' },
    { id: 'asia', name: 'Asia' },
    { id: 'africa', name: 'África' },
    { id: 'oceania', name: 'Oceanía' }
  ];

  useEffect(() => {
    // Si ya hay destinos en el store, usarlos directamente
    if (store.destinos.length > 0) {
      setDestinos(store.destinos);
      setFilteredDestinos(store.destinos);
      setLoading(false);
    } 
    // Solo cargar si no hay destinos y no se están cargando globalmente
    else if (!store.isLoading) {
      setLoading(true);
      setError(null);
      actions.getDestinos()
        .catch(err => {
          setError("Error al cargar los destinos. Por favor, inténtalo de nuevo.");
          console.error("Error fetching destinos:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [store.destinos, store.isLoading]);

  // Filtro de destinos
  useEffect(() => {
    let result = [...(destinos.length > 0 ? destinos : store.destinos)];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(destino => 
        destino.nombre.toLowerCase().includes(term) || 
        destino.descripcion.toLowerCase().includes(term) ||
        (destino.ubicacion && destino.ubicacion.toLowerCase().includes(term))
      );
    }
    
    // Filtrar por región
    if (selectedRegion !== 'todos') {
      result = result.filter(destino => 
        destino.ubicacion && destino.ubicacion.toLowerCase().includes(selectedRegion))
    }
    
    setFilteredDestinos(result);
  }, [searchTerm, selectedRegion, destinos]);

  const handleViewDetails = (id) => {
    navigate(`/destino/${id}`);
  };

  return (
    <div className="destinos-page">
      <Navbar />
      
      <div className="destinos-container">
        {/* Hero Section */}
        <section className="destinos-hero">
          <div className="hero-content">
            <h1>Descubre el Mundo</h1>
            <p>Explora nuestros destinos únicos </p>
          </div>
          <div className="hero-overlay"></div>
        </section>

        {/* Controls Section */}
        <div className="destinos-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar destinos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          
          {/* <div className="regions-container">
            {regions.map(region => (
              <button
                key={region.id}
                className={`region-btn ${selectedRegion === region.id ? 'active' : ''}`}
                onClick={() => setSelectedRegion(region.id)}
              >
                {region.name}
              </button>
            ))}
          </div> */}
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="destinos-skeleton-grid">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="destino-skeleton-card">
                <div className="skeleton-image-destino"></div>
                <div className="skeleton-content-destino">
                  <div className="skeleton-title-destino"></div>
                  <div className="skeleton-text-destino"></div>
                  <div className="skeleton-text-destino short"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        )}

        {/* Destinos Grid */}
        {!loading && !error && (
          <div className="destinos-grid">
            {filteredDestinos.length > 0 ? (
              filteredDestinos.map(destino => (
                <div 
                  key={destino.idDestino} 
                  className="destino-card"
                  onClick={() => {
                    navigate(`/cursos?destino=${encodeURIComponent(destino.nombre)}`);
                    setSelected(null); // cerrar modal
                  }}
                //   onClick={() => handleViewDetails(destino.idDestino)}
                >
                  {destino.imageUrl ? (
                    <img 
                      src={destino.imageUrl} 
                      alt={destino.nombre} 
                      className="destino-image"
                    />
                  ) : (
                    <div className="image-placeholder">
                      {/* <i className="fas fa-globe-americas"></i> */}
                    </div>
                  )}
                  
                  <div className="destino-overlay">
                    <div className="destino-content">
                      <h3>{destino.nombre}</h3>
                      {destino.ubicacion && (
                        <p className="location">
                          <i className="fas fa-map-marker-alt"></i> {destino.ubicacion}
                        </p>
                      )}
                      <p className="description">{destino.descripcion}</p>
                    </div>
                  </div>
                  
                  <div className="destino-badge">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <i className="fas fa-globe-americas"></i>
                <h3>No se encontraron destinos</h3>
                <p>Intenta con otros términos de búsqueda o selecciona otra región</p>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <section className="destinos-cta">
          <div className="cta-content">
            <h2>¿Listo para tu próxima aventura?</h2>
            <p>Descubre cómo podemos ayudarte a encontrar el destino perfecto para aprender idiomas</p>
            <button 
              className="cta-button"
              onClick={() => window.open(`https://wa.me/584142677943`, "_blank")}
            >
              Contáctanos <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Destinos;