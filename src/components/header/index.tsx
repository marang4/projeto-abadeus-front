import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function Header() {
  const { estaAutenticado, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleSair = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="w-100 bg-white shadow-sm sticky-top border-bottom py-2">
      {/* Utilizamos 'container' nativo para espaçamento ideal, sem restringir demais a largura */}
      <div className="container d-flex justify-content-between align-items-center h-100">
        {/* LADO ESQUERDO: LOGO SENAC */}
        <Link to="/" className="text-decoration-none">
          <img
            src="/logo-senac-removebg-preview.png"
            alt="Logo Senac"
            className="img-fluid"
            style={{ maxHeight: "45px" }} // Única limitação razoável para a logo não quebrar o layout
          />
        </Link>

        {/* LADO DIREITO: ÍCONES E AUTENTICAÇÃO */}
        <div className="d-flex align-items-center gap-3 gap-md-4 fs-4 text-dark">
          {/* Carrinho de Compras (Sempre visível) */}
          <Link
            to="/carrinho"
            className="text-dark text-decoration-none"
            title="Carrinho"
          >
            <i className="bi bi-cart2" role="button"></i>
          </Link>

          {/* Lógica de Autenticação */}
          {estaAutenticado ? (
            <>
              {/* Meus Ingressos: Escondido no mobile (d-none d-md-block) para evitar conflito com a Tab Bar */}
              <Link
                to="/ingressos"
                className="text-dark text-decoration-none d-none d-md-block"
                title="Meus Ingressos"
              >
                <i className="bi bi-ticket-detailed" role="button"></i>
              </Link>

              {/* Menu do Usuário: Escondido no mobile pelo mesmo motivo */}
              <div className="dropdown d-none d-md-block">
                <button
                  className="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ boxShadow: "none" }}
                >
                  <i className="bi bi-person-circle fs-4"></i>
                  <span className="fs-6 fw-light">
                    {usuario?.nome?.split(" ")[0] || "Perfil"}
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-3">
                  <li>
                    <Link className="dropdown-item py-2" to="/perfil">
                      <i className="bi bi-person me-2 text-muted"></i> Meu
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2" to="/ingressos">
                      <i className="bi bi-ticket-detailed me-2 text-muted"></i>{" "}
                      Meus Ingressos
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger py-2 fw-medium"
                      onClick={handleSair}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Sair
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            /* Botão Entrar: Usa as cores do Bootstrap para destacar a ação */
            <Link
              to="/login"
              className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-2 px-3 py-2"
              title="Entrar"
            >
              <i className="bi bi-person-circle fs-5"></i>
              <span className="fw-medium fs-6 d-none d-sm-inline">Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
