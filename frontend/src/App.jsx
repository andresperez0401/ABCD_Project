import React from 'react';
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { ToastContainer } from "react-toastify";
import injectContext from "./store/appContext.jsx";
import Navbar from './components/Navbar.jsx';
import StartPage from './components/StartPage.jsx';
import WhatsAppButton from "./components/WhatsAppButton.jsx";

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
        {/* <Route path="/home" element={<ListPaddel />} /> */}
      </Routes>
      <WhatsAppButton />
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
          <AppContentWithFlux />
        </Router>
    </div>
  );
}

export default App;