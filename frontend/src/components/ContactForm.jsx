import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { db } from '../store/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FiUser, FiMail, FiPhone, FiGlobe } from 'react-icons/fi';
import '../styles/ContactForm.css';

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.interests.trim()) newErrors.interests = 'Indica tus intereses';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const docRef = await addDoc(collection(db, "contactos"), {
        ...formData,
        fecha: serverTimestamp(),
        origen: "formulario-web"
      });
      
      if(onSubmit) onSubmit(formData);
      
      setSubmitStatus({ 
        type: 'success', 
        message: '¡Gracias! Tu información ha sido enviada.' 
      });
      setFormData({ name: '', email: '', phone: '', interests: '' });
      
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Error al enviar. Por favor intenta nuevamente.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <div className="input-icon">
            <FiUser className="icon" />
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre completo*"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <div className="input-icon">
            <FiMail className="icon" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico*"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
            <div className="input-icon">
                <FiPhone className="icon" />
            </div>
            <div className="phone-input-container">
                <PhoneInput
                international
                defaultCountry="ES"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Teléfono"
                className="phone-input-element"
                />
            </div>
        </div>

        <div className={`form-group ${errors.interests ? 'has-error' : ''}`}>
            <div className="input-icon">
                <FiGlobe className="icon" />
            </div>
            <div className="interests-container">
                <textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                rows="3"
                placeholder="Países/cursos de interés*"
                />
            </div>
            {errors.interests && <span className="error-text">{errors.interests}</span>}
        </div>

        {submitStatus && (
          <div className={`submit-status ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? (
            <span className="spinner"></span>
          ) : (
            'Registrarme ahora'
          )}
        </button>
      </form>
      
      <div className="form-footer">
        {/* <p>Al enviar aceptas nuestra <a href="/politica-privacidad">Política de Privacidad</a></p> */}
      </div>
    </div>
  );
};

export default ContactForm;