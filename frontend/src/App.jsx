import React from 'react';
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import { ToastContainer } from "react-toastify";
import injectContext from "./store/appContext.jsx";
import Navbar from './components/Navbar.jsx';
import StartPage from './components/StartPage.jsx';
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import ContactPage from './components/ContactPage.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Login from './components/Login.jsx';
import AdminClientes from './components/AdminClientes.jsx';
import Servicios from './components/Servicios.jsx';
import Destinos from './components/Destinos.jsx';
import Cursos from './components/Cursos.jsx';
import AdminCursos from './components/AdminCursos.jsx';
import ProtectedRoute from './components/ProtectedRoute';


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
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/cursos" element={<Cursos />} />
        {/* <Route path="/home" element={<ListPaddel />} /> */}


        {/* Rutas Protegidas */}
        <Route 
          path="/admin/cursos" 
          element={
            <ProtectedRoute>
              <AdminCursos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminClientes />
            </ProtectedRoute>
          } 
        />


      </Routes>
      <WhatsAppButton />
      <Footer />

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