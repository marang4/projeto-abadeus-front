import React from "react";
import { Outlet } from "react-router-dom";

export default function LayoutLogin() {
  return (
    // Fundo para centralizar tudo no meio do monitor
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
      {/* Aqui está o segredo: não importa o tamanho do monitor, ele nunca passa de 400px */}
      <div className="w-100 px-3" style={{ maxWidth: "400px" }}>
        <Outlet />
      </div>
    </div>
  );
}
