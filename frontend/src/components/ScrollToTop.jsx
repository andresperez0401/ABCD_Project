import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Esperamos brevemente para dejar que React monte la vista
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      // Alternativa agresiva: document.documentElement.scrollTop = 0;
    }, 50); // pequeño delay para evitar que algo empuje el scroll después

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
