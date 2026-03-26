import { Route, Routes } from "react-router-dom";
import { RotaPrivada } from "./assets/components/rotaPrivada"; // <-- ATENÇÃO: Ajuste o caminho se necessário

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import LayoutLogin from "./assets/components/layoutLogin";
import LayoutAdmin from "./assets/components/layoutAdmin";
import Cadastro from "./pages/cadastre-se";
import EsqueciSenha from "./pages/esqueciSenha";
import PerfilPage from "./assets/perfilPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<LayoutLogin />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      </Route>

      {/* Catraca fechada: Envolvemos o LayoutAdmin com a RotaPrivada */}
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
    </Routes>
  );
}

export default AppRoutes;
