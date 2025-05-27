import React, { useEffect, useRef, useState, useContext } from "react";
import { Context } from "../store/appContext.jsx";
import Globe from "globe.gl";
import Modal from "react-modal";
import "../styles/GloboCursos.css";

Modal.setAppElement("#root");


export default function GloboCursos() {
  const globeEl = useRef();
  const [world, setWorld] = useState([]);
  const [selected, setSelected] = useState(null);

  //Cargamos los paises desde el contexto
  const {store, actions} = useContext(Context);

  //Paises
  const SELECTED_COUNTRIES = store.SELECTED_COUNTRIES;

  //Info de los cursos
  const cursos = store.infoPaises;


  // 1) Cargar GeoJSON
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then(r => r.json())
      .then(data => setWorld(data.features));
  }, []);

  // 2) Inicializar Globe
  useEffect(() => {
    if (!globeEl.current || !world.length) return;

    // textura negra 1×1
    const BLACK_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABlBMVEUAAAD///+l2Z/dAAAACklEQVQI12NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=";

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
      // tamaño igual al padre (.globo-container)
      .width(globeEl.current.parentElement.clientWidth)
      .height(globeEl.current.parentElement.clientHeight)
      .pointOfView({ lat: 0, lng: 0, altitude: 1.2 }, 0);

    // Retina & antialias
    globe.renderer().setPixelRatio(window.devicePixelRatio);
    globe.renderer().antialias = true;
    // Bloquear zoom
    globe.controls().enableZoom = false;

    // Ajuste en resize
    const handleResize = () => {
      const w = globeEl.current.parentElement.clientWidth;
      globe.width(w).height(w);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      globeEl.current.innerHTML = "";
    };
  }, [world]);

  return (
    <>
      <div className="globe-canvas" ref={globeEl} />

      {selected && (
        <Modal
          isOpen
          onRequestClose={() => setSelected(null)}
          style={{
            overlay: {
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(51, 51, 51, 0.8)", zIndex: 10000
            },
            content: {
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff", color: "#222",
              maxWidth: "400px", width: "90%",
              padding: "30px", borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0,0,0,0.8)",
              border: "none", zIndex: 10001
            }
          }}
        >
          <header className="modal-header">
            <h2>{selected.name}</h2>
            <button className="modal-close" onClick={() => setSelected(null)}>×</button>
          </header>
          <div className="modal-body">
            <p>{selected.description}</p>
          </div>
        </Modal>
      )}
    </>
  );
}
