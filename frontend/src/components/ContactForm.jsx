import React, { useState, useContext } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { db } from '../store/firebase.js'; // Si ya no lo usas para Firestore, puedes eliminarlo
import { FiUser, FiMail, FiPhone, FiGlobe } from 'react-icons/fi';
import { Context } from '../store/appContext.jsx';
import { toast } from 'react-toastify';
import '../styles/ContactForm.css';

const ContactForm = () => {
  const { actions } = useContext(Context);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.interests.trim()) newErrors.interests = 'Indica tus intereses';
    return newErrors;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePhoneChange = value => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      // Llamamos al action que registra el cliente en la BD
      const { success, message } = await actions.createCliente({
        nombre: formData.name,
        email: formData.email,
        telefono: formData.phone,
        interes: formData.interests
      });

      if (success) {
        toast.success('¡Gracias! Tu información ha sido enviada.');
        setFormData({ name: '', email: '', phone: '', interests: '' });
      } else {
        toast.error(message || 'Error al enviar datos');
      }
    } catch (err) {
      toast.error('Error de conexión: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="contact-form">
        {/* Nombre */}
        <div className="form-group">
          <div className="input-icon"><FiUser className="icon" /></div>
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
        {/* Email */}
        <div className="form-group">
          <div className="input-icon"><FiMail className="icon" /></div>
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
        {/* Teléfono */}
        <div className="form-group">
          <div className="input-icon"><FiPhone className="icon" /></div>
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
        {/* Intereses */}
        <div className={`form-group ${errors.interests ? 'has-error' : ''}`}>
          <div className="input-icon"><FiGlobe className="icon" /></div>
          <textarea
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            rows="3"
            placeholder="Países/cursos de interés*"
          />
          {errors.interests && <span className="error-text">{errors.interests}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? <span className="spinner"></span> : 'Registrarme ahora'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
