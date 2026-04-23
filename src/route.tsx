import { Route, Routes } from "react-router-dom";
import { RotaPrivada } from "./components/rotaPrivada"; 

import Home from "./pages/home"; // Verifique se home é default ou named
import Login from "./pages/auth/login"; // AJUSTADO: Importação default conforme solicitado
import LayoutAdmin from "./components/layoutAdmin"; // O componente que você me mostrou no print
import Cadastro from "./pages/auth/cadastre-se";
import EsqueciSenha from "./pages/auth/esqueciSenha";
import ResetarSenha from "./pages/resetarSenha"; 
import PerfilPage from "./pages/perfilPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas (Sem o LayoutLogin que você removeu) */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/resetarsenha" element={<ResetarSenha />} />

      {/* Rotas Privadas (Admin) */}
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

      {/* Fallback: Se não achar nada, manda pro login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;