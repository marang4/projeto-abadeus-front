import React from "react";
import { Link } from "react-router-dom"; // Assumindo que você usa react-router-dom para navegação interna

interface DadosDoEvento {
  titulo: string;
  descricao: string;
  chamada: string;
  data: string;
  local: string;
  realizacao: string;
  linkAcesso: string;
  imagemCapa: string; // Adicionado: Um evento profissional precisa de apelo visual
}

export function Home() {
  // Dados atualizados com placeholder para o contexto do Senac
  // Atualize com os dados reais assim que os tiver.
  const evento: DadosDoEvento = {
    titulo: "Workshop de Inovação\ne Tecnologia",
    descricao:
      "Participe do maior encontro de tecnologia promovido pelo Senac. Um dia inteiro de palestras, networking e imersão nas principais tendências do mercado de desenvolvimento de software.",
    chamada:
      "Garanta seu ingresso agora e prepare-se para transformar sua carreira.",
    data: "15 de Novembro de 2026",
    local: "Auditório Principal - Senac SC",
    realizacao: "Senac Santa Catarina",
    linkAcesso: "/comprar", // Deve apontar para a rota real de checkout ou detalhes
    imagemCapa:
      "https://placehold.co/800x600/004b87/FFFFFF?text=Capa+do+Evento+Senac", // Azul Senac aproximado
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center g-5">
        {/* Coluna Esquerda: Imagem de Destaque */}
        <div className="col-12 col-lg-6">
          <img
            src={evento.imagemCapa}
            alt={`Capa do evento ${evento.titulo}`}
            className="img-fluid rounded-4 shadow-lg w-100"
            style={{ objectFit: "cover", maxHeight: "500px" }} // Única exceção para garantir o corte correto da imagem
          />
        </div>

        {/* Coluna Direita: Informações e Conversão (Call to Action) */}
        <div className="col-12 col-lg-6 d-flex flex-column gap-3">
          {/* Badge de Destaque */}
          <span className="badge bg-warning text-dark align-self-start fs-6 px-3 py-2 rounded-pill shadow-sm">
            Evento em Destaque
          </span>

          <h1
            className="fw-bolder display-5 text-dark"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {evento.titulo}
          </h1>

          <p className="text-secondary fs-5 lh-lg mb-2">{evento.descricao}</p>

          {/* Card de Informações Técnicas */}
          <div className="bg-light p-4 rounded-3 border-start border-warning border-5 shadow-sm my-2">
            <ul className="list-unstyled mb-0 d-flex flex-column gap-3 fs-5 text-dark">
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-calendar-event text-primary fs-4"></i>
                <span>
                  <strong className="fw-semibold">Data:</strong> {evento.data}
                </span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt text-primary fs-4"></i>
                <span>
                  <strong className="fw-semibold">Local:</strong> {evento.local}
                </span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-building text-primary fs-4"></i>
                <span>
                  <strong className="fw-semibold">Realização:</strong>{" "}
                  {evento.realizacao}
                </span>
              </li>
            </ul>
          </div>

          <p className="fw-medium text-dark mb-1">{evento.chamada}</p>

          {/* Botão de Conversão */}
          {/* Utilizando bg-warning (laranja/amarelo) para criar alto contraste com o azul do Header */}
          <Link
            to={evento.linkAcesso}
            className="btn btn-warning btn-lg fw-bold text-dark w-100 shadow py-3 text-uppercase mt-2"
          >
            Comprar Ingresso
          </Link>
        </div>
      </div>
    </div>
  );
}
