import React from 'react';
import '../styles/Loader.css';

const Loader = ({ message = "Cargando cursos", subtext = "Preparando tu experiencia" }) => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="loader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <div className="loader-text">{message}</div>
        <div className="loader-subtext">
          {subtext}
          <span className="loader-dots">
            <span className="loader-dot"></span>
            <span className="loader-dot"></span>
            <span className="loader-dot"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export const MiniLoader = () => {
  return (
    <div className="mini-loader">
      <div className="mini-spinner"></div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-shimmer"></div>
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
      </div>
    </div>
  );
};

export default Loader;
