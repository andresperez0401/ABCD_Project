import React, { useState, useContext } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { db } from '../store/firebase.js'; // Si ya no lo usas para Firestore, puedes eliminarlo
import { FiUser, FiMail, FiPhone, FiGlobe, FiClock, FiHash } from 'react-icons/fi';
import { Context } from '../store/appContext.jsx';
import { toast } from 'react-toastify';
import '../styles/ContactForm.css';

const ContactForm = () => {
  const { actions } = useContext(Context);
  const SOURCE_OPTIONS = [
    { value: 'Ferias', label: 'Ferias (evento presencial)' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Google', label: 'Google (buscador)' },
    { value: 'Referido', label: 'Referido (alguien te recomendó)' },
    { value: 'Otro', label: 'Otro (especificar)' }
  ];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: '',
    duration: '',
    age: '',
    howHeard: '',
    howHeardOther: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.interests.trim()) newErrors.interests = 'Indica tus intereses';
    if (!formData.duration.trim()) newErrors.duration = 'Duración requerida';
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) <= 0) newErrors.age = 'Edad inválida';
    if (!formData.howHeard) newErrors.howHeard = 'Selecciona una opción';
    if (formData.howHeard === 'Otro' && !formData.howHeardOther.trim()) newErrors.howHeardOther = 'Especifica el origen';
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
        interes: formData.interests,
        duracion: formData.duration,
        edad: formData.age,
        como_se_entero: formData.howHeard,
        como_se_entero_otro: formData.howHeard === 'Otro' ? formData.howHeardOther : null
      });

      if (success) {
        toast.success('¡Gracias! Tu información ha sido enviada.');
        setFormData({ name: '', email: '', phone: '', interests: '', duration: '', age: '', howHeard: '', howHeardOther: '' });
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

        {/* Duración */}
        <div className={`form-group ${errors.duration ? 'has-error' : ''}`}>
          <div className="input-icon"><FiClock className="icon" /></div>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duración del curso (ej: 4 semanas)*"
            className={errors.duration ? 'error' : ''}
          />
          {errors.duration && <span className="error-text">{errors.duration}</span>}
        </div>

        {/* Edad */}
        <div className={`form-group ${errors.age ? 'has-error' : ''}`}>
          <div className="input-icon"><FiHash className="icon" /></div>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Edad*"
            className={errors.age ? 'error' : ''}
            min="1"
          />
          {errors.age && <span className="error-text">{errors.age}</span>}
        </div>

        {/* ¿Cómo se enteró? */}
        <div className={`form-group ${errors.howHeard ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="howHeard">
            ¿Cómo te enteraste de nosotros?*
          </label>

          <div className="control-with-icon">
            <div className="input-icon"><FiUser className="icon" /></div>

            <select
              id="howHeard"
              name="howHeard"
              value={formData.howHeard}
              onChange={handleChange}
              className={errors.howHeard ? 'error' : ''}
              required
            >
              <option value="" disabled>Selecciona una opción</option>
              {SOURCE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {errors.howHeard && <span className="error-text">{errors.howHeard}</span>}
        </div>


        {formData.howHeard === 'Otro' && (
          <div className={`form-group ${errors.howHeardOther ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="howHeardOther">
              Por favor especifica*
            </label>

            <div className="control-with-icon">
              <div className="input-icon"><FiUser className="icon" /></div>

              <input
                id="howHeardOther"
                type="text"
                name="howHeardOther"
                value={formData.howHeardOther}
                onChange={handleChange}
                placeholder="¿Cómo te enteraste?"
                className={errors.howHeardOther ? 'error' : ''}
                required
              />
            </div>

            {errors.howHeardOther && (
              <span className="error-text">{errors.howHeardOther}</span>
            )}
          </div>
        )}


        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? <span className="spinner"></span> : 'Registrarme ahora'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
