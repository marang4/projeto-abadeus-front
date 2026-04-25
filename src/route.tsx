import { Route, Routes } from "react-router-dom";
import { RotaPrivada } from "./components/rotaPrivada"; 
import Home from "./pages/home"; 
import Login from "./pages/auth/login"; 
import LayoutAdmin from "./components/layoutAdmin"; 
import Cadastro from "./pages/auth/cadastre-se";
import EsqueciSenha from "./pages/auth/esqueciSenha";
import ResetarSenha from "./pages/resetarSenha"; 
import PerfilPage from "./pages/perfilPage";
import EventoAdminPage from "./pages/admin/eventosAdmin";
import CategoriaEventoAdminPage from "./pages/admin/categoriaEventoAdmin";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/resetarsenha" element={<ResetarSenha />} />

      <Route
        element={
          <RotaPrivada>
            <LayoutAdmin />
          </RotaPrivada>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/eventos" element={<EventoAdminPage />} />
        <Route path="/categoria-evento" element={<CategoriaEventoAdminPage />} />
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;