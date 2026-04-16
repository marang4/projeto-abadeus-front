import React from 'react';
import { Link } from "react-router-dom";
import Footer from "../../components/footer"; // Ajuste o caminho conforme a sua pasta

// Interface para garantir a tipagem correta dos eventos
interface DadosDoEvento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  preco: number;
  imagemCapa: string;
}

export function Home() {
  // Cores do Sistema
  const azulSistema = "#1453bd";
  const laranjaSistema = "#f19000";

  // Mock de Dados: Substitua isso depois por uma chamada à sua API (ex: useEffect chamando o back-end)
  const eventoDestaque: DadosDoEvento = {
    id: "evt-001",
    titulo: "Senac Tech Summit 2026",
    descricao: "O maior encontro de tecnologia de Santa Catarina. Um dia inteiro de palestras, networking e imersão nas principais tendências de software e IA.",
    data: "15 de Nov • 09:00",
    local: "Auditório Principal - Criciúma/SC",
    preco: 150.00,
    imagemCapa: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  };

  const proximosEventos: DadosDoEvento[] = [
    {
      id: "evt-002",
      titulo: "Workshop: Liderança Ágil",
      descricao: "Aprenda a gerenciar equipes de alta performance em ambientes dinâmicos.",
      data: "22 de Nov • 14:00",
      local: "Senac Centro - Joinville/SC",
      preco: 85.00,
      imagemCapa: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "evt-003",
      titulo: "Bootcamp: Fullstack Java",
      descricao: "Imersão prática para construir uma aplicação completa com as melhores práticas.",
      data: "05 de Dez • 08:00",
      local: "Lab 3 - Florianópolis/SC",
      preco: 250.00,
      imagemCapa: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "evt-004",
      titulo: "Palestra: Futuro da IA",
      descricao: "Impactos da Inteligência Artificial no mercado de trabalho e na educação.",
      data: "12 de Dez • 19:00",
      local: "Evento Online (Ao Vivo)",
      preco: 0.00, // Gratuito
      imagemCapa: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    }
  ];

  return (
    // min-vh-100 garante que a página ocupe a tela toda e empurre o footer para baixo
    <div className="d-flex flex-column min-vh-100 bg-light">
      
      {/* SEÇÃO HERO: Evento em Destaque */}
      <section 
        className="position-relative d-flex align-items-center" 
        style={{ 
          minHeight: "80vh",
          backgroundImage: `linear-gradient(to right, rgba(20, 83, 189, 0.95), rgba(20, 83, 189, 0.7)), url(${eventoDestaque.imagemCapa})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff"
        }}
      >
        <div className="container py-5">
          <div className="row">
            <div className="col-12 col-lg-7">
              <span 
                className="badge px-3 py-2 rounded-pill mb-3 shadow-sm"
                style={{ backgroundColor: laranjaSistema, color: "#fff", fontSize: "0.9rem" }}
              >
                <i className="bi bi-star-fill me-2"></i>Evento em Destaque
              </span>
              
              <h1 className="display-3 fw-bolder mb-3" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                {eventoDestaque.titulo}
              </h1>
              
              <p className="fs-5 mb-4" style={{ maxWidth: "600px", lineHeight: "1.6", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                {eventoDestaque.descricao}
              </p>

              <div className="d-flex flex-wrap gap-4 mb-5">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-calendar3 fs-4" style={{ color: laranjaSistema }}></i>
                  <span className="fs-5 fw-medium">{eventoDestaque.data}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt-fill fs-4" style={{ color: laranjaSistema }}></i>
                  <span className="fs-5 fw-medium">{eventoDestaque.local}</span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-4">
                <Link 
                  to={`/comprar/${eventoDestaque.id}`} 
                  className="btn btn-lg fw-bold px-5 py-3 shadow"
                  style={{ backgroundColor: laranjaSistema, color: "#fff", border: "none", transition: "transform 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  Garantir Ingresso
                </Link>
                <span className="fs-3 fw-bold">
                  {eventoDestaque.preco === 0 ? "Gratuito" : `R$ ${eventoDestaque.preco.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO VITRINE: Próximos Eventos */}
      <section className="py-5 flex-grow-1">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: azulSistema }}>Próximos Eventos</h2>
              <p className="text-muted m-0">Descubra novas experiências e oportunidades de aprendizado.</p>
            </div>
            <Link to="/eventos" className="text-decoration-none fw-bold" style={{ color: laranjaSistema }}>
              Ver todos <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {proximosEventos.map((evento) => (
              <div className="col-12 col-md-6 col-lg-4" key={evento.id}>
                {/* Card de Evento */}
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                  }}
                >
                  <div className="position-relative">
                    <img 
                      src={evento.imagemCapa} 
                      alt={evento.titulo} 
                      className="card-img-top" 
                      style={{ height: "200px", objectFit: "cover" }} 
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-white text-dark shadow-sm px-3 py-2 rounded-pill fw-bold">
                        {evento.preco === 0 ? "Grátis" : `R$ ${evento.preco.toFixed(2).replace('.', ',')}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="text-muted small mb-2 d-flex align-items-center gap-2">
                      <i className="bi bi-calendar2-event" style={{ color: azulSistema }}></i>
                      {evento.data}
                    </div>
                    <h5 className="card-title fw-bold text-dark mb-2">{evento.titulo}</h5>
                    <p className="card-text text-secondary small mb-4 flex-grow-1">
                      {evento.descricao}
                    </p>
                    
                    <Link 
                      to={`/comprar/${evento.id}`} 
                      className="btn w-100 fw-bold py-2 mt-auto"
                      style={{ 
                        backgroundColor: "#f8fafc", 
                        color: azulSistema, 
                        border: `1px solid ${azulSistema}30` 
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = azulSistema;
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                        e.currentTarget.style.color = azulSistema;
                      }}
                    >
                      Comprar Ingresso
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER INJETADO AQUI */}
      <Footer />
    </div>
  );
}

export default Home; // Export default corrigido (Tiramos aquele 'export home' estranho)