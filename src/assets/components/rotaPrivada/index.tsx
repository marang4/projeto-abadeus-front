import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // <-- Lembre-se de ajustar este caminho para onde está o seu AuthProvider

interface RotaPrivadaProps {
  children: JSX.Element;
}

export const RotaPrivada = ({ children }: RotaPrivadaProps) => {
  const { estaAutenticado, loading } = useAuth();

  // Enquanto verifica o token, mostra o spinner do Bootstrap
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // Se não estiver logado, manda pro login
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza o componente filho normalmente
  return children;
};
