import React from "react";
import Modal from "react-modal";
import {
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaLanguage,
  FaHotel,
  FaGlobe,
  FaTimes,
} from "react-icons/fa";
import "../styles/CourseModal.css";

Modal.setAppElement("#root");

export default function CourseModal({ isOpen, onRequestClose, course }) {
  if (!course) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="course-modal"
      overlayClassName="course-overlay"
      closeTimeoutMS={300}
    >
      <button className="cm-close" onClick={onRequestClose}>
        <FaTimes />
      </button>
      <div className="cm-header">
        <div
          className="cm-image"
          style={{ backgroundImage: `url(${course.imageUrl})` }}
        />
        <h2 className="cm-title">{course.name}</h2>
      </div>
      <div className="cm-body">
        <p className="cm-desc">{course.description}</p>
        <ul className="cm-info">
          <li><FaGlobe /> <strong>Destinos:</strong> {course.destinos}</li>
          <li><FaUsers /> <strong>Edades:</strong> {course.edades}</li>
          <li><FaClock /> <strong>Duración:</strong> {course.duration}</li>
          <li><FaHotel /> <strong>Servicios:</strong> {course.services}</li>
          <li><FaLanguage /> <strong>Idiomas:</strong> {course.idiomas}</li>
        </ul>
      </div>
      <div className="cm-footer">
        <button className="cm-btn" onClick={onRequestClose}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
}
