import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import LayoutLogin from "./assets/components/layoutLogin"; // Verifique se o caminho da importação está correto
import LayoutAdmin from "./assets/components/layoutAdmin";
import Cadastro from "./pages/cadastre-se";
import EsqueciSenha from "./pages/esqueciSenha";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<LayoutLogin />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      </Route>

      <Route element={<LayoutAdmin />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
