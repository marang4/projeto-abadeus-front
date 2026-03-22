import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // <-- Confirme o caminho do seu AuthContext

export function Header() {
  const { estaAutenticado, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleSair = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      className="w-100 shadow-sm sticky-top" // Adicionei sticky-top para fixar o cabeçalho no topo
      style={{ backgroundColor: "#000134", height: "80px" }}
    >
      <div className="col-12 col-md-10 col-lg-8 mx-auto h-100 d-flex justify-content-between align-items-center px-3">
        {/* LADO ESQUERDO: LOGO DA ABADEUS (Mantido idêntico) */}
        <Link
          to="/"
          className="bg-white text-center rounded-bottom px-2 py-2 h-100 d-flex flex-column justify-content-center shadow-sm text-decoration-none"
          style={{ width: "90px" }}
        >
          <img
            src="/logo-abadeus.png"
            alt="Logo Abadeus Eventos"
            className="img-fluid mx-auto mb-1"
            style={{ maxWidth: "45px" }}
          />
          <span
            className="fw-bold lh-1 text-dark"
            style={{ fontSize: "0.65rem" }}
          >
            Abadeus
            <br />
            Eventos
          </span>
        </Link>

        {/* LADO DIREITO: ÍCONES E AUTENTICAÇÃO */}
        <div className="d-flex align-items-center gap-4 fs-4">
          {/* Carrinho de Compras (Sempre visível) */}
          <Link
            to="/carrinho"
            className="text-white text-decoration-none"
            title="Carrinho"
          >
            <i className="bi bi-cart2" role="button"></i>
          </Link>

          {/* Lógica de Autenticação */}
          {estaAutenticado ? (
            <>
              {/* Meus Ingressos (Visível apenas se logado) */}
              <Link
                to="/ingressos"
                className="text-white text-decoration-none"
                title="Meus Ingressos"
              >
                <i className="bi bi-ticket-detailed" role="button"></i>
              </Link>

              {/* Menu Suspenso (Dropdown) do Bonequinho */}
              <div className="dropdown">
                <button
                  className="btn btn-link text-white text-decoration-none p-0 d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ boxShadow: "none" }} // Remove a borda feia ao clicar
                >
                  <i className="bi bi-person-circle fs-4"></i>
                  <span className="fs-6 d-none d-md-block fw-light">
                    {/* Exibe apenas o primeiro nome do usuário */}
                    {usuario?.nome?.split(" ")[0] || "Perfil"}
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-3">
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
            /* Botão Entrar (Visível apenas se NÃO estiver logado) */
            <Link
              to="/login"
              className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 rounded-2 px-3 py-1"
              title="Entrar"
            >
              <i className="bi bi-person-circle fs-5"></i>
              <span className="fw-medium fs-6 d-none d-sm-inline">Entrar</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
