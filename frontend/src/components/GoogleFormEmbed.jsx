import React from "react";
import '../styles/GoogleEmbed.css';

export default function GoogleFormEmbed() {
  return (
    <div className="form-wrapper">
      <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSe6dez25K2vyoQik3OrtPGV7M3eCXFKRKtLOivSBV4Toi9hXA/viewform?embedded=true" 
      width="100%" 
      height="1418"
      frameborder="0"
      marginheight="0"
      marginwidth="0">
        Cargando…
      </iframe>
    </div>
  );
}
