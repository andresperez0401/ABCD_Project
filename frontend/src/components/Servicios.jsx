// src/components/Servicios.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext.jsx';
import Navbar from './Navbar';
import Footer from './Footer'; // Asumiendo que tienes un componente Footer
import { SkeletonCard } from './Loader';
import '../styles/Servicios.css';
import { Link } from 'react-router-dom';

const Servicios = () => {
  const { store, actions } = useContext(Context);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredServicios, setFilteredServicios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  
  // Categorías basadas en tus servicios
  const categories = [
    { id: 'todos', name: 'Todos los Servicios' },
    { id: 'alojamiento', name: 'Alojamiento' },
    { id: 'academico', name: 'Académico' },
    { id: 'transporte', name: 'Transporte' },
    { id: 'otros', name: 'Otros' }
  ];

  useEffect(() => {
    const fetchServicios = async () => {
      setLoading(true);
      setError(null);
      try {
        // Carga optimizada sin esperas innecesarias
        await actions.getServicios();
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los servicios. Por favor, inténtalo de nuevo.");
        setLoading(false);
        console.error("Error fetching servicios:", err);
      }
    };

    fetchServicios();
  }, []);

  useEffect(() => {
    setServicios(store.servicios);
    setFilteredServicios(store.servicios);
  }, [store.servicios]);

  // Filtro de servicios
  useEffect(() => {
    let result = [...servicios];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(servicio => 
        servicio.nombre.toLowerCase().includes(term) || 
        servicio.descripcion.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categoría
    if (selectedCategory !== 'todos') {
      result = result.filter(servicio => servicio.categoria === selectedCategory);
    }
    
    setFilteredServicios(result);
  }, [searchTerm, selectedCategory, servicios]);

  // Función para determinar la categoría basada en el nombre
  const getCategory = (nombre) => {
    if (nombre.toLowerCase().includes('alojamiento') || nombre.toLowerCase().includes('hotel')) 
      return 'alojamiento';
    if (nombre.toLowerCase().includes('curso') || nombre.toLowerCase().includes('académico')) 
      return 'academico';
    if (nombre.toLowerCase().includes('transporte') || nombre.toLowerCase().includes('vuelo')) 
      return 'transporte';
    return 'otros';
  };

  // Estilos para las categorías
  const categoryStyles = {
    alojamiento: { background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)' },
    academico: { background: 'linear-gradient(135deg, #e8e8e8 0%, #f8f8f8 100%)' },
    transporte: { background: 'linear-gradient(135deg, #f0f0f0 0%, #fafafa 100%)' },
    otros: { background: 'linear-gradient(135deg, #ececec 0%, #f6f6f6 100%)' }
  };

  return (
    <div className="servicios-page">
      <Navbar />
      
      <div className="servicios-container">
        {/* Hero Section */}
        <section className="servicios-hero">
          <div className="hero-content">
            <h1>Nuestros Servicios</h1>
            <p>Descubre todo lo que ofrecemos para hacer de tu experiencia algo inolvidable</p>
          </div>
          <div className="hero-overlay"></div>
        </section>

        {/* Controls Section */}
        <div className="servicios-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          
          {/* <div className="categories-container">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div> */}
        </div>

        {/* Loading State with Skeletons */}
        {loading && (
          <div className="servicios-grid">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && (
          <div className="servicios-grid">
            {filteredServicios.length > 0 ? (
              filteredServicios.map(servicio => {
                const category = getCategory(servicio.nombre);
                return (
                  <div 
                    key={servicio.idServicio} 
                    className="servicio-card"
                    style={categoryStyles[category]}
                  >
                    <div className="card-header">
                      <div className="category-tag">{categories.find(c => c.id === category)?.name}</div>
                      {servicio.imageUrl ? (
                        <img 
                          src={servicio.imageUrl} 
                          alt={servicio.nombre} 
                          className="servicio-image"
                        />
                      ) : (
                        <div className="image-placeholder">
                          <i className="fas fa-image"></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="card-body">
                      <h3>{servicio.nombre}</h3>
                      <p>{servicio.descripcion}</p>
                      
                      {servicio.precio && (
                        <div className="price-container">
                          {/* <span>Desde</span>
                          <div className="price">${servicio.precio}</div> */}
                        </div>
                      )}
                    </div>
                    
                    <div className="card-footer">
                      <button
                        className="info-btn"
                        onClick={() => window.open(`https://wa.me/584142677943`, "_blank")}
                      >
                        Más información <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <h3>No se encontraron servicios</h3>
                <p>Intenta con otros términos de búsqueda o selecciona otra categoría</p>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <section className="servicios-cta">
          <div className="cta-content">
            <h2>¿No encuentras lo que necesitas?</h2>
            <p>Contáctanos y crearemos una solución personalizada para ti</p>
            <Link to="/contacto">
              <button className="cta-button">
                Contactar ahora
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Servicios;