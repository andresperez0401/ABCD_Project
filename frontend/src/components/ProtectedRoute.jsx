import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  // consigue tu token de donde lo guardes
  const token = localStorage.getItem('token');

  // aquí puedes verificar la vigencia del token, p.ej. decode el exp
  if (!token) {
    // si no hay token, redirige a login y guarda la ruta
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // si todo ok, renderiza el hijo (la ruta admin)
  return children;
};

export default ProtectedRoute;
