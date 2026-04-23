import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import logoSenac from "../../pages/home/images/logo.png";

export function Header() {
  const { estaAutenticado, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const azulSistema = "#1453bd";
  const laranjaSistema = "#f19000";

  const handleSair = async () => {
    await logout();
    navigate("/login");
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = laranjaSistema;
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = "#ffffff";
  };

  return (
    <header 
      className="w-100 shadow-sm sticky-top py-2"
      style={{ 
        background: `linear-gradient(to right, ${laranjaSistema}, ${azulSistema})`, 
        borderBottom: "1px solid rgba(255,255,255,0.1)" 
      }}
    >
      <div className="container-fluid px-4 px-md-5 d-flex justify-content-between align-items-center h-100">
        
       <Link to="/" className="text-decoration-none ms-5 ps-5"> 
          <img
            src={logoSenac}
            alt="Logo Senac"
            className="img-fluid"
            style={{ maxHeight: "80px", transition: "0.2s" }} 
          />
        </Link>

        <div className="d-flex align-items-center gap-3 gap-md-4 fs-4 text-white">
          
          <Link
            to="/carrinho"
            className="text-decoration-none d-flex align-items-center"
            title="Carrinho"
            style={{ color: "#ffffff", transition: "color 0.2s" }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <i className="bi bi-cart2" role="button"></i>
          </Link>

          {estaAutenticado ? (
            <>
              <Link
                to="/ingressos"
                className="text-decoration-none d-none d-md-block"
                title="Meus Ingressos"
                style={{ color: "#ffffff", transition: "color 0.2s" }}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <i className="bi bi-ticket-detailed" role="button"></i>
              </Link>

              <div className="dropdown d-none d-md-block">
                <button
                  className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ boxShadow: "none", color: "#ffffff", transition: "color 0.2s" }}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  <i className="bi bi-person-circle fs-4"></i>
                  <span className="fs-6 fw-medium">
                    {usuario?.nome?.split(" ")[0] || "Perfil"}
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-3 rounded-3">
                  <li>
                    <Link className="dropdown-item py-2 fw-medium" to="/perfil">
                      <i className="bi bi-person me-2" style={{ color: azulSistema }}></i> Meu Perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 fw-medium" to="/ingressos">
                      <i className="bi bi-ticket-detailed me-2" style={{ color: azulSistema }}></i> Meus Ingressos
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger py-2 fw-bold"
                      onClick={handleSair}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Sair
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-bold"
              title="Entrar"
              style={{ 
                backgroundColor: "transparent", 
                color: "#ffffff", 
                border: "2px solid #ffffff",
                transition: "all 0.2s" 
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = azulSistema; 
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              <i className="bi bi-person-circle fs-5"></i>
              <span className="fs-6 d-none d-sm-inline">Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;