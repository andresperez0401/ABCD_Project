import React from 'react';
import ContactForm from './ContactForm';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/ContactPage.css'; // Nuevo archivo CSS

const ContactPage = () => {
  const handleSubmit = (data) => {
    // Misma lógica que en StartPage
  };

  return (
    <div className="start-page">
      <Navbar />
      <section className="contact-page-section">
        <div className="contact-page-header">
          <h1>Contáctanos</h1>
          <p>Completa el formulario y nuestro equipo te responderá en breve</p>
        </div>
        <ContactForm onSubmit={handleSubmit} />
      </section>
    </div>
  );
};

export default ContactPage;