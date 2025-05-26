import React from 'react';
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { ToastContainer } from "react-toastify";
import injectContext from "./store/appContext.jsx";


const AppContent = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/Propietario" ||
    location.pathname.startsWith("/Canchas/") ||
    location.pathname === "/Configuraciones";


  return (
    <>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/home" element={<ListPaddel />} />
      </Routes>
      {!hideLayout && <Footer />}

      {/* Para alertas y notificaciones de la app */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
};

// 2️⃣ Ahora envolvemos ese component con nuestro HOC de Flux/Context:
const AppContentWithFlux = injectContext(AppContent);

function App() {
  return (
    <div className="App">
        <Router>
          <h1> HOLAAA</h1>
          <AppContentWithFlux />
        </Router>
    </div>
  );
}

export default App;