import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import { Context } from "../store/appContext.jsx";
import Globe from "globe.gl";
import * as THREE from 'three';
import Modal from "react-modal";
import "../styles/GloboCursos.css";

Modal.setAppElement("#root");

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
        // Usamos la ref para obtener el valor actual de selected
        const currentSelected = selectionRef.current;
        if (currentSelected && currentSelected.country === d.name) return "#ffffff";
        return SELECTED_COUNTRIES.includes(d.name) ? "#e0f7fa" : "#78909c";
      })
      .polygonSideColor(() => "rgba(0,0,0,0)")
      .polygonStrokeColor(() => "#37474f")
      .polygonAltitude(({ properties: d }) => {
        const currentSelected = selectionRef.current;
        if (currentSelected && currentSelected.country === d.name) return 0.05;
        return SELECTED_COUNTRIES.includes(d.name) ? 0.03 : 0.005;
      })
      .onPolygonClick(p => {
        const curso = cursos.find(c => c.country === p.properties.name);
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
  useEffect(() => {
    if (!globeInstanceRef.current) return;
    
    // Actualizamos las funciones de estilo
    globeInstanceRef.current
      .polygonCapColor(({ properties: d }) => {
        if (selected && selected.country === d.name) return "#ffffff";
        return SELECTED_COUNTRIES.includes(d.name) ? "#e0f7fa" : "#78909c";
      })
      .polygonAltitude(({ properties: d }) => {
        if (selected && selected.country === d.name) return 0.05;
        return SELECTED_COUNTRIES.includes(d.name) ? 0.03 : 0.005;
      });

    // Forzar actualización de los polígonos
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
                <p>Cargando el mundo de oportunidades...</p>
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
              backgroundColor: "rgba(51, 51, 51, 0.8)", 
              zIndex: 10000
            },
            content: {
              position: "absolute",
              top: "50%", 
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff", 
              color: "#222",
              maxWidth: "400px", 
              width: "90%",
              padding: "30px", 
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0,0,0,0.8)",
              border: "none", 
              zIndex: 10001
            }
          }}
        >
          <header className="modal-header">
            <h2>{selected.name}</h2>
            <button 
              className="modal-close" 
              onClick={() => setSelected(null)}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>
          <div className="modal-body">
            <p>{selected.description}</p>
          </div>
        </Modal>
      )}
    </>
  );
}