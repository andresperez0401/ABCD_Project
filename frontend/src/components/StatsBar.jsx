import React from "react";
import CountUp from "react-countup";
import "./StatsBar.css";

const stats = [
  { label: "Estudiantes enviados", end: 2000, suffix: "+" },
  { label: "Años de experiencia", end: 20, suffix: " años" },
  { label: "Países destino", end: 15, suffix: "+" },
];

const StatsBar = () => (
  <section className="stats-bar">
    {stats.map(({ label, end, suffix }, i) => (
      <div key={i} className="stat-box">
        <h3 className="stat-number">
          <CountUp end={end} duration={2} />{suffix}
        </h3>
        <p className="stat-label">{label}</p>
      </div>
    ))}
  </section>
);

export default StatsBar;
