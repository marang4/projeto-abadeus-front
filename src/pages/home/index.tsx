import React from "react";

interface DadosDoEvento {
  titulo: string;
  descricao: string;
  chamada: string;
  data: string;
  local: string;
  realizacao: string;
  linkAcesso: string;
}

export function Home() {
  const evento: DadosDoEvento = {
    titulo: "17ª Paella do\nBem Abadeus",

    descricao:
      "No dia 20 de setembro, a Instituição Abadeus realizará mais uma edição do tradicional Evento de Paella Beneficente, que acontecerá na Rua da Gente.\n\nEste evento tem como principal objetivo arrecadar fundos para apoiar os projetos sociais da instituição, que atua há anos transformando vidas e oferecendo oportunidades a famílias em situação de vulnerabilidade.",
    chamada:
      "Venha participar, traga sua família e amigos, e ajude a fortalecer esta causa tão importante.",
    data: "20 de setembro",
    local: "Rua da Gente",
    realizacao: "Instituição Abadeus",
    linkAcesso: "#",
  };

  return (
    <div className="w-100 d-flex justify-content-center">
      <div className="col-12 col-md-10 col-lg-8 p-3">
        <div
          className="rounded p-4 text-center shadow-sm"
          style={{ backgroundColor: "#e9ecef" }}
        >
          <h1
            className="fw-bold fs-3 mb-4 text-dark"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {evento.titulo}
          </h1>

          <hr className="border-dark opacity-100 border-2 mb-4" />

          <div className="px-3 px-md-5">
            <p
              className="text-center mb-4 text-dark"
              style={{ fontSize: "0.85rem", whiteSpace: "pre-wrap" }}
            >
              {evento.descricao}
            </p>
          </div>

          <hr className="border-dark opacity-100 border-2 my-4" />

          <div className="px-3 px-md-5">
            <p className="mb-4 text-dark" style={{ fontSize: "0.85rem" }}>
              {evento.chamada}
            </p>
          </div>

          <div
            className="fw-bold mb-4 text-dark"
            style={{ fontSize: "0.9rem" }}
          >
            <div>Data: {evento.data}</div>
            <div>Local: {evento.local}</div>
            <div>Realização: {evento.realizacao}</div>
          </div>

          <a
            href={evento.linkAcesso}
            className="btn text-white px-5 py-2 rounded-0 border-0"
            style={{ backgroundColor: "#000134", textDecoration: "none" }}
          >
            Acesse aqui
          </a>
        </div>
      </div>
    </div>
  );
}
