import { Outlet } from "react-router-dom";

export default function LayoutLogin() {
  return (
    // Fundo cinza claro para destacar o card branco
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center">
      {/* REMOVIDO: maxWidth fixo de 400px. 
        Agora o layout é flexível e quem manda na largura é a página interna.
      */}
      <div className="w-100 px-3 d-flex justify-content-center">
        <Outlet />
      </div>
    </div>
  );
}