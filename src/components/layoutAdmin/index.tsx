import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import { Header } from "../header";
import Tabs from "../tabs";
import { useAuth } from "../../contexts/AuthContext";

function LayoutAdmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, usuario } = useAuth();

  const handleSair = async () => {
    await logout();
  };

  return (
    <div className="d-flex flex-column min-vh-100 position-relative overflow-x-hidden bg-light">
      <Header />

      <div className="d-flex flex-grow-1">
        <main className="flex-grow-1 w-100 px-0 mt-4 mb-5 pb-5 mb-md-0 pb-md-0">
          <Outlet />
        </main>
      </div>

      <Tabs onMoreClick={() => setIsSidebarOpen(true)} />

      <Offcanvas 
        show={isSidebarOpen} 
        onHide={() => setIsSidebarOpen(false)} 
        placement="bottom" 
        className="d-md-none rounded-top-4"
        style={{ height: 'auto' }}
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="px-0 py-2">
          <ul className="list-group list-group-flush fs-5">
            {usuario?.role === "ROLE_ADMIN" && (
              <li className="list-group-item border-0">
                <Link
                  to="/eventos"
                  className="text-decoration-none text-dark d-flex align-items-center gap-3 py-2 px-3"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className="bi bi-calendar-event text-primary"></i>
                  Eventos Admin
                </Link>
              </li>
            )}

            <li className="list-group-item border-0">
              <Link
                to="/perfil"
                className="text-decoration-none text-dark d-flex align-items-center gap-3 py-2 px-3"
                onClick={() => setIsSidebarOpen(false)}
              >
                <i className="bi bi-person text-primary"></i>
                Meu Perfil
              </Link>
            </li>

            <li className="list-group-item border-0 mt-2">
              <button
                className="btn btn-link text-danger text-decoration-none p-0 d-flex align-items-center gap-3 py-2 px-3 fw-medium w-100 text-start"
                onClick={handleSair}
              >
                <i className="bi bi-box-arrow-right"></i>
                Sair da conta
              </button>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default LayoutAdmin;