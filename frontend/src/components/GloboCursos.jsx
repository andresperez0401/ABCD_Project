// GloboCursos.jsx
import React, { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import Modal from "react-modal";
import "../styles/GloboCursos.css"; 

Modal.setAppElement("#root");

const SELECTED_COUNTRIES = [
  "Spain",
  "United Kingdom",
  "Canada",
  "Brazil",
];

const cursos = [
  { country: "Spain", name: "Curso en España", description: "Madrid, cursos intensivos de español." },
  { country: "United Kingdom", name: "Curso en UK", description: "Londres, inglés para todos los niveles." },
  { country: "Canada", name: "Curso en Canada", description: "Aprende Inglés en las mejores escuelas de Canada" },
  { country: "Brazil", name: "Curso en Brasil", description: "São Paulo, portugués brasileño." },
];

export default function GloboCursos() {
  const globeEl = useRef();
  const [world, setWorld] = useState([]);
  const [selected, setSelected] = useState(null);

  // 1. Cargo GeoJSON
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then(r => r.json())
      .then(data => setWorld(data.features));
  }, []);

  // 2. Inicializo Globe.gl
  useEffect(() => {
    if (!globeEl.current || !world.length) return;

    // textura 1×1 negra
    const BLACK_PIXEL =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABlBMVEUAAAD///+l2Z/dAAAACklEQVQI12NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=";

    const globe = Globe()(globeEl.current)
      .showGlobe(true)
      .globeImageUrl(BLACK_PIXEL)
      .showGraticules(false)
      .polygonsData(world)
      .polygonCapColor(({ properties: d }) =>
        SELECTED_COUNTRIES.includes(d.name) ? "#ffffff" : "#444444"
      )
      .polygonSideColor(() => "rgba(0,0,0,0)")
      .polygonStrokeColor(() => "#222222")
      .polygonAltitude(({ properties: d }) =>
        SELECTED_COUNTRIES.includes(d.name) ? 0.03 : 0.005
      )
      .onPolygonClick(p => {
        const curso = cursos.find(c => c.country === p.properties.name);
        setSelected(curso);
      })
      .onPolygonHover(() => null)
      // ajustamos tamaño inicial
      .width(globeEl.current.clientWidth)
      .height(globeEl.current.clientHeight)
      // cámara bien cerca
      .pointOfView({ lat: 0, lng: 0, altitude: 1.2 }, 0);

    // retina & antialias
    globe.renderer().setPixelRatio(window.devicePixelRatio);
    globe.renderer().antialias = true;

    // deshabilito zoom
    globe.controls().enableZoom = false;

    // resize listener para adaptar siempre al div
    const handleResize = () => {
      const w = globeEl.current.clientWidth;
      globe.width(w).height(w); // cuadrado perfecto
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      globeEl.current.innerHTML = "";
    };
  }, [world]);

  return (
    <>
      {/* contenedor circular responsive */}
      <div
        className="globe-canvas"
        ref={globeEl}
      />

      {/* modal dark-mode */}
      {selected && (
        <Modal
        isOpen
        onRequestClose={() => setSelected(null)}
        style={{
            overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 10000
            },
            content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            background: '#111',
            color: '#eee',
            maxWidth: '400px',
            width: '90%',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 15px rgba(0,0,0,0.7)',
            zIndex: 10001
            }
        }}
        >
          <h2 style={{ marginBottom: "10px" }}>{selected.name}</h2>
          <p style={{ lineHeight: "1.5" }}>{selected.description}</p>
          <button
            onClick={() => setSelected(null)}
            style={{
              marginTop: "20px",
              padding: "10px 15px",
              border: "none",
              borderRadius: "4px",
              background: "#fff",
              color: "#000",
              cursor: "pointer"
            }}
          >
            Cerrar
          </button>
        </Modal>
      )}
    </>
  );
}
