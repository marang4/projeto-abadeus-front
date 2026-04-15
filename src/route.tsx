import { Route, Routes } from "react-router-dom";
import { RotaPrivada } from "./components/rotaPrivada"; // Verifique o caminho

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import LayoutLogin from "./components/layoutLogin";
import LayoutAdmin from "./components/layoutAdmin";
import Cadastro from "./pages/cadastre-se";
import EsqueciSenha from "./pages/esqueciSenha";
import PerfilPage from "./components/perfilPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<LayoutLogin />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      </Route>

      {/* Rotas Privadas */}
      <Route
        element={
          <RotaPrivada>
            <LayoutAdmin />
          </RotaPrivada>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<PerfilPage />} />
      </Route>

      {/* Fallback de Segurança */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;