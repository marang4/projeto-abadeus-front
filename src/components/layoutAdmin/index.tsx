import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Header } from "../header";
import Tabs from "../tabs";
import { useAuth } from "../../contexts/authContext";

function LayoutAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleSair = async () => {
    await logout();
  };

  return (
    // overflow-hidden no X garante que nunca haverá rolagem horizontal indesejada
    <div className="d-flex flex-column min-vh-100 position-relative overflow-x-hidden">
      <Header />

      {/* A MÁGICA ESTÁ AQUI:
        - Removido o container-fluid
        - Adicionado w-100 (100% de largura)
        - px-0 (zero padding lateral)
        - Mantido o espaçamento inferior (mb-5 pb-5) só para o mobile não esconder conteúdo atrás das Tabs
      */}
      <main className="flex-grow-1 w-100 px-0 mt-4 mb-5 pb-5 mb-md-0 pb-md-0">
        <Outlet />
      </main>

      <Tabs onMoreClick={() => setIsSidebarOpen(true)} />

      {/* MENU MOBILE (Offcanvas) */}
      {isSidebarOpen && (
        <>
          <div
            className="offcanvas-backdrop fade show d-md-none"
            onClick={() => setIsSidebarOpen(false)}
            style={{ zIndex: 1040 }}
          ></div>

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