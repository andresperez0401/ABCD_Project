import React, { useContext, useRef, useEffect, useState } from "react";
import { Context } from "../store/appContext"; 
import { FaMapMarkerAlt, FaClock, FaUsers, FaLanguage, FaCouch } from "react-icons/fa";
import "../styles/CourseCards.css";
import  CourseModal  from "./CourseModal.jsx";

export default function CourseCards() {

  //Contexto de la app
  const { store } = useContext(Context);
  const cardsRef = useRef([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });
    return () => observer.disconnect();
  }, [store.cursos]);


   const handleViewMore = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  return (
    <>
        <div className="cards-wrapper">
        {store.cursos.map((curso, idx) => (
            <div
            key={curso.country}
            className="card"
            ref={el => (cardsRef.current[idx] = el)}
            >
            <div
                className="card-image"
                style={{ backgroundImage: `url(${curso.imageUrl})` }}
            />
            <div className="card-content">
                <h3>{curso.name}</h3>
                <p className="card-desc">{curso.description}</p>
                <ul className="card-info">
                <li><FaMapMarkerAlt /> {curso.destinos}</li>
                <li><FaUsers /> {curso.edades}</li>
                <li><FaClock /> {curso.duration}</li>
                <li><FaCouch /> {curso.services}</li>
                <li><FaLanguage /> {curso.idiomas}</li>
                </ul>
                <button className="card-btn" onClick={() => handleViewMore(curso)}>
                Ver más
                </button>
            </div>
            </div>
        ))}
        </div>

        <CourseModal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            course={selectedCourse}
        />
    </>
  );
}
