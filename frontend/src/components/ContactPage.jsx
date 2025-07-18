import React from 'react';
import ContactForm from './ContactForm';
import Navbar from './Navbar';
import '../styles/StartPage.css';

const ContactPage = () => {
  const handleSubmit = (data) => {
    // Misma lógica que en StartPage
  };

  return (
    <div className="start-page">
      <Navbar />
      <section className="contact-section" style={{ minHeight: '80vh' }}>
        <h1 style={{ textAlign: 'center' }}>Contáctanos</h1>
        <ContactForm onSubmit={handleSubmit} />
      </section>
    </div>
  );
};

export default ContactPage;