// src/components/StatsBar.jsx
import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import "../styles/StatsBar.css";

const stats = [
  { label: "Estudiantes enviados", end: 1500, suffix: "+" },
  { label: "Años de experiencia", end: 15, suffix: "+" },
  { label: "Destinos", end: 70, suffix: "+" },
];

const StatsBar = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-container">
        {stats.map(({ label, end, suffix }, i) => (
          <motion.div 
            key={i}
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <div className="stat-bar">
              <motion.div
                className="stat-bar-fill"
                initial={{ width: 0 }}
                animate={visible ? { width: "100%" } : {}}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              />
            </div>
            <h3 className="stat-number">
              {visible ? (
                <CountUp 
                  end={end} 
                  duration={2} 
                  delay={0.5}
                  separator=","
                />
              ) : "0"}
              {suffix}
            </h3>
            <p className="stat-label">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;