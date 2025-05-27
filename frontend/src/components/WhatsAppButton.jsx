// src/components/WhatsAppButton.jsx
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/WhatsAppButton.css";

const WhatsAppButton = () => {
  const phoneNumber = "584144208885";

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  return (
    <button className="whatsapp-btn" onClick={handleClick}>
      <FaWhatsapp size={28} />
    </button>
  );
};

export default WhatsAppButton;
