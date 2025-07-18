import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const ContactForm = ({ onSubmit }) => {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwoegDKYaRCNOpubKJUXEUmUKw0c5bTBHBdaoBKVoJGrw-HYhSH2pmJExri-_fEMoh21Q/exec';

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
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsSubmitting(true);
  setSubmitStatus(null);

  try {
    const callbackName = `googleScriptCallback_${Date.now()}`;

    window[callbackName] = (response) => {
      if (response.success) {
        setSubmitStatus({ type: 'success', message: response.message });
        setFormData({ name: '', email: '', phone: '', interests: '' });
      } else {
        setSubmitStatus({ type: 'error', message: response.message });
      }
      setIsSubmitting(false);

      // Limpieza
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    const script = document.createElement('script');
    script.src = `${GOOGLE_SCRIPT_URL}?callback=${callbackName}&data=${encodeURIComponent(
      JSON.stringify(formData)
    )}`;
    script.onerror = () => {
      setSubmitStatus({ type: 'error', message: 'Error de conexión. Intenta recargar la página.' });
      setIsSubmitting(false);
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    document.body.appendChild(script);

  } catch (error) {
    setSubmitStatus({ type: 'error', message: error.message });
    setIsSubmitting(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label>Nombre completo*</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
          placeholder="Ej: María González"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>Correo electrónico*</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          placeholder="Ej: contacto@ejemplo.com"
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <PhoneInput
          international
          defaultCountry="ES"
          value={formData.phone}
          onChange={handlePhoneChange}
          className="phone-input"
          placeholder="Ingresa tu número"
        />
      </div>

      <div className="form-group">
        <label>Países/cursos de interés*</label>
        <textarea
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          rows="4"
          className={errors.interests ? 'error' : ''}
          placeholder="Ej: Cursos de inglés en Canadá y español en Colombia"
        />
        {errors.interests && <span className="error-text">{errors.interests}</span>}
      </div>

      {submitStatus && (
        <div className={`submit-status ${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? (
          <>
            <span className="spinner"></span> Enviando...
          </>
        ) : (
          'Registrarme ahora'
        )}
      </button>
    </form>
  );
};

export default ContactForm;