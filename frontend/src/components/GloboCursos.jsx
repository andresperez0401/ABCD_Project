import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import { Context } from "../store/appContext.jsx";
import Globe from "globe.gl";
import * as THREE from 'three';
import Modal from "react-modal";
import "../styles/GloboCursos.css";

Modal.setAppElement("#root");

// Agrega este mapeo de nombres en la parte superior de tu componente
const COUNTRY_NAME_MAP = {
  "Australia": "Australia",
  "United Kingdom": "United Kingdom of Great Britain and Northern Ireland",
  "Canada": "Canada",
  "EEUU": "United States",
  "South Africa": "South Africa",
  "United Arab Emirates": "United Arab Emirates",
  "Malta": "Malta"
};

export default function GloboCursos() {
  // Referencias
  const globeEl = useRef();
  const containerRef = useRef();
  const globeInstanceRef = useRef(null);
  
  // Estados
  const [world, setWorld] = useState([]);
  const [selected, setSelected] = useState(null);
  const [globeSize, setGlobeSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Contexto de la aplicación
  const { store } = useContext(Context);
  const SELECTED_COUNTRIES = store.SELECTED_COUNTRIES;
  const cursos = store.infoPaises;

  // Ref para mantener la función actualizada de selección
  const selectionRef = useRef(selected);
  useEffect(() => {
    selectionRef.current = selected;
  }, [selected]);

  // ========================================================
  // 1. CARGAR DATOS GEOGRÁFICOS
  // ========================================================
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    
    setLoading(true);
    setError(null);
    
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", { signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then(data => {
        setWorld(data.features);
        setError(null);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error cargando el GeoJSON:", err);
          setError("Error al cargar el mapa. Por favor, inténtalo de nuevo más tarde.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
    
    return () => controller.abort();
  }, []);

  // ========================================================
  // 2. ACTUALIZAR DIMENSIONES DEL GLOBO
  // ========================================================
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const size = Math.min(container.clientWidth, container.clientHeight);
        setGlobeSize(size);
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  // ========================================================
  // 3. INICIALIZAR EL GLOBO (SOLO UNA VEZ)
  // ========================================================
  const initGlobe = useCallback(() => {
    if (!globeEl.current || !world.length || !globeSize) return;
    
    // Limpiar instancia anterior si existe
    if (globeInstanceRef.current) {
      globeInstanceRef.current._destructor();
      globeEl.current.innerHTML = "";
    }

    // Material para el océano
    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: "#1a73e8",
      roughness: 0.7,
      metalness: 0.1,
      emissive: "#0a4da8",
      emissiveIntensity: 0.3
    });

    // Crear nueva instancia del globo
    const globe = Globe()(globeEl.current)
      .showGlobe(true)
      .globeImageUrl(null)
      .backgroundImageUrl(null)
      .backgroundColor("rgba(0, 0, 0, 0)") 
      .globeMaterial(oceanMaterial)
      .showGraticules(false)
      .polygonsData(world)
      .polygonCapColor(({ properties: d }) => {
        const currentSelected = selectionRef.current;
        const mappedName = COUNTRY_NAME_MAP[d.name] || d.name;
        
        if (currentSelected && currentSelected.country === mappedName) return "#ffffff";
        return SELECTED_COUNTRIES.includes(mappedName) ? "#e0f7fa" : "#78909c";
      })
      .polygonSideColor(() => "rgba(0,0,0,0)")
      .polygonStrokeColor(() => "#37474f")
      .polygonAltitude(({ properties: d }) => {
        const currentSelected = selectionRef.current;
        const mappedName = COUNTRY_NAME_MAP[d.name] || d.name;
        
        if (currentSelected && currentSelected.country === mappedName) return 0.05;
        return SELECTED_COUNTRIES.includes(mappedName) ? 0.03 : 0.005;
      })
      .onPolygonClick(p => {
        const countryName = COUNTRY_NAME_MAP[p.properties.name] || p.properties.name;
        const curso = cursos.find(c => c.country === countryName);
        setSelected(curso);
      })
      .onPolygonHover(() => null)
      .width(globeSize)
      .height(globeSize)
      .pointOfView({ lat: 0, lng: 0, altitude: 1.2 }, 0);

    // Configuración del renderizado
    globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio, 2));
    globe.renderer().antialias = true;
    
    // Configuración de controles
    globe.controls().enableZoom = false;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    // Guardar referencia a la instancia
    globeInstanceRef.current = globe;

    // Manejar redimensionamiento
    const handleResize = () => {
      if (containerRef.current) {
        const size = Math.min(containerRef.current.clientWidth, containerRef.current.clientHeight);
        globe.width(size).height(size);
      }
    };

    window.addEventListener("resize", handleResize);
    
    // Limpieza al desmontar
    return () => {
      window.removeEventListener("resize", handleResize);
      if (globeInstanceRef.current) {
        globeInstanceRef.current._destructor();
      }
    };
  }, [world, globeSize, SELECTED_COUNTRIES, cursos]);

  // Inicializar el globo cuando los datos estén listos
  useEffect(() => {
    if (world.length && globeSize && !loading && !error) {
      initGlobe();
    }
  }, [world, globeSize, loading, error, initGlobe]);

  // ========================================================
  // 4. ACTUALIZAR EL GLOBO CUANDO CAMBIA LA SELECCIÓN
  // ========================================================
  // Actualiza el useEffect que maneja los cambios de selección
  useEffect(() => {
    if (!globeInstanceRef.current) return;
    
    globeInstanceRef.current
      .polygonCapColor(({ properties: d }) => {
        const mappedName = COUNTRY_NAME_MAP[d.name] || d.name;
        if (selected && selected.country === mappedName) return "#ffffff";
        return SELECTED_COUNTRIES.includes(mappedName) ? "#e0f7fa" : "#78909c";
      })
      .polygonAltitude(({ properties: d }) => {
        const mappedName = COUNTRY_NAME_MAP[d.name] || d.name;
        if (selected && selected.country === mappedName) return 0.05;
        return SELECTED_COUNTRIES.includes(mappedName) ? 0.03 : 0.005;
      });

    // Forzar actualización
    const currentData = globeInstanceRef.current.polygonsData();
    globeInstanceRef.current.polygonsData([...currentData]);
  }, [selected, SELECTED_COUNTRIES]);

  // ========================================================
  // RENDERIZADO
  // ========================================================
  return (
    <>
      <div className="globe-container" ref={containerRef}>
        {/* Spinner de carga o mensaje de error */}
        {(loading || error) && (
          <div className="globe-placeholder">
            {loading ? (
              <>
                <div className="spinner"></div>
                <p>Cargando ...</p>
              </>
            ) : (
              <p className="error-message">{error}</p>
            )}
          </div>
        )}
        
        {/* Canvas para el globo - solo visible cuando no hay carga ni error */}
        <div 
          className="globe-canvas" 
          ref={globeEl} 
          style={{ 
            width: `${globeSize}px`, 
            height: `${globeSize}px`,
            borderRadius: "50%",
            overflow: "hidden",
            background: "#e3f2fd",
            display: (loading || error) ? "none" : "block"
          }} 
        />
      </div>

      {/* Modal para detalles del curso */}
      {selected && (
        <Modal
          isOpen
          onRequestClose={() => setSelected(null)}
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            },
            content: {
              position: "relative",
              inset: "unset",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "visible",
              boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
              color: "#222",
              fontSize: "1.1rem",
              lineHeight: "1.6"
            }
          }}
        >
          <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <h2 style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: "bold"
            }}>{selected.name}</h2>
            <button 
              onClick={() => setSelected(null)} 
              aria-label="Cerrar modal"
              style={{
                background: "none",
                border: "none",
                fontSize: "1.8rem",
                cursor: "pointer",
                color: "#666"
              }}
            >×</button>
          </header>

          <div>
            {selected.imageUrl && (
              <img 
                src={selected.imageUrl} 
                alt={`Imagen de ${selected.name}`}
                style={{
                  width: "100%",
                  maxHeight: "350px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "20px"
                }}
              />
            )}
            <p>{selected.description}</p>
          </div>
        </Modal>
      )}
    </>
  );
}