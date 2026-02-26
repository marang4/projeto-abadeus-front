import React from "react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <div
      className="w-100 shadow-sm"
      style={{ backgroundColor: "#000134", height: "80px" }}
    >
      <div className="col-12 col-md-10 col-lg-8 mx-auto h-100 d-flex justify-content-between align-items-center px-3">
        <Link
          to="/"
          className="bg-white text-center rounded-bottom px-2 py-2 h-100 d-flex flex-column justify-content-center shadow-sm text-decoration-none"
          style={{ width: "90px" }}
        >
          <img
            src="/logo-abadeus.png"
            alt="Logo Abadeus Eventos"
            className="img-fluid mx-auto mb-1"
            style={{ maxWidth: "45px" }}
          />
          <span
            className="fw-bold lh-1 text-dark"
            style={{ fontSize: "0.65rem" }}
          >
            Abadeus
            <br />
            Eventos
          </span>
        </Link>

        <div className="d-flex gap-4 fs-4">
          <Link
            to="/ingressos"
            className="text-white text-decoration-none"
            title="Meus Ingressos"
          >
            <i className="bi bi-ticket-detailed" role="button"></i>
          </Link>

          <Link
            to="/carrinho"
            className="text-white text-decoration-none"
            title="Carrinho"
          >
            <i className="bi bi-cart2" role="button"></i>
          </Link>

          <Link
            to="/perfil"
            className="text-white text-decoration-none"
            title="Meu Perfil"
          >
            <i className="bi bi-person-circle" role="button"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
