import React, { useEffect, useRef, useState, useContext } from "react";
import { Context } from "../store/appContext.jsx";
import Globe from "globe.gl";
import * as THREE from 'three';
import Modal from "react-modal";
import "../styles/GloboCursos.css";

Modal.setAppElement("#root");

export default function GloboCursos() {
  const globeEl = useRef();
  const containerRef = useRef();
  const [world, setWorld] = useState([]);
  const [selected, setSelected] = useState(null);
  const [globeSize, setGlobeSize] = useState(0);

  // Cargamos los paises desde el contexto
  const { store } = useContext(Context);

  // Países
  const SELECTED_COUNTRIES = store.SELECTED_COUNTRIES;

  // Info de los cursos
  const cursos = store.infoPaises;

  // 1) Cargar GeoJSON
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then(r => r.json())
      .then(data => setWorld(data.features));
  }, []);

  // Actualizar dimensiones al cambiar tamaño
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const size = Math.min(
          container.clientWidth, 
          container.clientHeight
        );
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

  // 2) Inicializar y actualizar Globe - SOLUCIÓN PRINCIPAL AQUÍ
  useEffect(() => {
    if (!globeEl.current || !world.length || !globeSize) return;

    // SOLUCIÓN SIMPLIFICADA - MATERIAL BÁSICO SIN LUCES
    // =================================================
    // 1. Material básico para el océano
    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: "#247ab3",       // Azul corporativo
      roughness: 0.7,         // Superficie ligeramente rugosa
      metalness: 0.1,         // Reflejo metálico mínimo
      emissive: "#0a4da8",    // Color base para sombras
      emissiveIntensity: 0.3  // Intensidad del color base
    });

    // 2. Configuración del globo sin texturas complejas
    const globe = Globe()(globeEl.current)
      .showGlobe(true)
      .globeImageUrl(null)    // Sin textura
      .backgroundImageUrl(null)
      .backgroundColor("rgba(0, 0, 0, 0)") 
      .globeMaterial(oceanMaterial) // Aplicamos el material básico
      .showGraticules(false)
      .polygonsData(world)
      .polygonCapColor(({ properties: d }) => {
        // Lógica mejorada de colores
        if (selected && selected.country === d.name) {
          return "#ffffff"; // País seleccionado - blanco
        }
        return SELECTED_COUNTRIES.includes(d.name) 
          ? "#e0f7fa"  // Países con cursos - azul muy claro
          : "#78909c"; // Países normales - gris azulado suave
      })
      .polygonSideColor(() => "rgba(0,0,0,0)") // Lados transparentes
      .polygonStrokeColor(() => "#37474f")     // Borde oscuro suave
      .polygonAltitude(({ properties: d }) => {
        // Altura basada en selección
        if (selected && selected.country === d.name) return 0.05;
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

    // Configuraciones de renderizado
    globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio, 2));
    globe.renderer().antialias = true;
    
    // Bloquear zoom
    globe.controls().enableZoom = false;
    
    // Rotación automática suave
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    // Ajustar tamaño al cambiar
    const handleResize = () => {
      if (containerRef.current) {
        const size = Math.min(
          containerRef.current.clientWidth, 
          containerRef.current.clientHeight
        );
        globe.width(size).height(size);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (globeEl.current) globeEl.current.innerHTML = "";
    };
  }, [world, globeSize, SELECTED_COUNTRIES, cursos, selected]); // Añadimos selected

  return (
    <>
      <div className="globe-container" ref={containerRef}>
        <div 
          className="globe-canvas" 
          ref={globeEl} 
          style={{ 
            width: `${globeSize}px`, 
            height: `${globeSize}px`,
            borderRadius: "50%",
            overflow: "hidden",
            background: "#e3f2fd" // Fondo azul claro uniforme
          }} 
        />
      </div>

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