import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./route";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext"; // <-- ATENÇÃO: Confirme se o caminho para o seu arquivo AuthContext.tsx está correto aqui

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
