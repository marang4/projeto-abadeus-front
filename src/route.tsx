import { Route, Routes } from "react-router-dom";
import { RotaPrivada } from "./components/rotaPrivada"; 

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import LayoutLogin from "./components/layoutLogin";
import LayoutAdmin from "./components/layoutAdmin";
import Cadastro from "./pages/cadastre-se";
import EsqueciSenha from "./pages/esqueciSenha";
import ResetarSenha from "./pages/resetarSenha"; // <-- CERTIFIQUE-SE DE IMPORTAR AQUI
import PerfilPage from "./components/perfilPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas (Login, Cadastro, Recuperação) */}
      <Route element={<LayoutLogin />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        
        {/* ESSA ROTA ESTAVA FALTANDO - É PARA ONDE O LINK DO EMAIL APONTA */}
        <Route path="/resetarsenha" element={<ResetarSenha />} />
      </Route>

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

      {/* Fallback de Segurança: Se não achar nada, manda pro login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;