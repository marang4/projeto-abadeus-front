import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

interface TabsProps {
  onMoreClick: () => void;
}

const Tabs: React.FC<TabsProps> = ({ onMoreClick }) => {
  const { estaAutenticado } = useAuth();

  if (!estaAutenticado) return null;

  return (
    <nav
      className="fixed-bottom d-flex d-md-none w-100 bg-white border-top py-2 justify-content-around shadow-lg"
      style={{ zIndex: 1030 }}
    >
      <NavLink
        to="/"
        className={({ isActive }) =>
          `d-flex flex-column align-items-center text-decoration-none ${isActive ? "text-primary" : "text-secondary"}`
        }
      >
        <i className="bi bi-house-door fs-4"></i>
        <span style={{ fontSize: "12px" }}>Início</span>
      </NavLink>

      {/* Rota principal alterada de Perfil para Ingressos */}
      <NavLink
        to="/ingressos"
        className={({ isActive }) =>
          `d-flex flex-column align-items-center text-decoration-none ${isActive ? "text-primary" : "text-secondary"}`
        }
      >
        <i className="bi bi-ticket-detailed fs-4"></i>
        <span style={{ fontSize: "12px" }}>Ingressos</span>
      </NavLink>

      <button
        className="d-flex flex-column align-items-center text-secondary border-0 bg-transparent"
        onClick={onMoreClick}
        type="button"
      >
        <i className="bi bi-three-dots fs-4"></i>
        <span style={{ fontSize: "12px" }}>Mais</span>
      </button>
    </nav>
  );
};

export default Tabs;
