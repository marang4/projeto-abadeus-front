import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Header } from "../header";
import Tabs from "../tabs";
import { useAuth } from "../../contexts/AuthContext"; // Importado para usar a função de logout no menu

function LayoutAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleSair = async () => {
    await logout();
    // O redirecionamento para o login geralmente é feito no Header ou em um useEffect observando a autenticação,
    // mas caso queira forçar, pode usar o useNavigate aqui também.
  };

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <Header />

      <main className="container mt-4 mb-5 pb-5 mb-md-4 pb-md-0 flex-grow-1">
        <Outlet />
      </main>

      <Tabs onMoreClick={() => setIsSidebarOpen(true)} />

      {/* COMPONENTE DO MENU MOBILE (Offcanvas customizado) */}
      {/* Só é renderizado se isSidebarOpen for true e for tela mobile (d-md-none) */}
      {isSidebarOpen && (
        <>
          {/* Fundo escuro (Backdrop) que fecha o menu ao clicar fora */}
          <div
            className="offcanvas-backdrop fade show d-md-none"
            onClick={() => setIsSidebarOpen(false)}
            style={{ zIndex: 1040 }}
          ></div>

          {/* Container do Menu Inferior */}
          <div
            className="offcanvas offcanvas-bottom show d-md-none rounded-top-4"
            style={{ visibility: "visible", height: "auto", zIndex: 1045 }}
            tabIndex={-1}
          >
            <div className="offcanvas-header border-bottom">
              <h5 className="offcanvas-title fw-bold">Menu</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Fechar"
              ></button>
            </div>

            <div className="offcanvas-body px-0 py-2">
              <ul className="list-group list-group-flush fs-5">
                {/* Apenas Perfil e Sair ficam escondidos no botão "Mais" */}
                <li className="list-group-item border-0">
                  <Link
                    to="/perfil"
                    className="text-decoration-none text-dark d-flex align-items-center gap-3 py-2"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <i className="bi bi-person text-primary"></i>
                    Meu Perfil
                  </Link>
                </li>

                <li className="list-group-item border-0 mt-2">
                  <button
                    className="btn btn-link text-danger text-decoration-none p-0 d-flex align-items-center gap-3 py-2 fw-medium w-100 text-start"
                    onClick={handleSair}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Sair da conta
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LayoutAdmin;
