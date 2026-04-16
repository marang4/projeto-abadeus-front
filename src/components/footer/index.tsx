import React from "react";
import { Link } from "react-router-dom";
import logoSenac from "../../pages/home/images/logo.png";

const Footer = () => {
  const azulSistema = "#1453bd";
  const laranjaSistema = "#f19000";

  const handleMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = laranjaSistema;
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
  };

  const handleMouseOutTitle = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = "#ffffff";
  };

  const handleMouseOutCopy = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
  };

  return (
    <footer 
      className="p-5 mt-auto" 
      style={{ backgroundColor: azulSistema }}
    >
      <div className="container-fluid px-md-5">
        
        <div className="row gy-4 text-center text-md-start justify-content-between">
          
          <div className="col-12 col-md-3">
            <h6 
              className="fw-bold mb-3 small text-white" 
              style={{ letterSpacing: '1px', transition: "0.2s" }}
              onMouseOver={handleMouseOver} 
              onMouseOut={handleMouseOutTitle}
            >
              CONTATO
            </h6>
            <p 
              className="small m-0 mb-1" 
              style={{ color: "rgba(255, 255, 255, 0.8)", transition: "0.2s" }}
              onMouseOver={handleMouseOver} 
              onMouseOut={handleMouseOut}
            >
              (48) 3251-0500
            </p>
            <p 
              className="small m-0" 
              style={{ color: "rgba(255, 255, 255, 0.8)", transition: "0.2s" }}
              onMouseOver={handleMouseOver} 
              onMouseOut={handleMouseOut}
            >
              contato@sc.senac.br
            </p>
          </div>

          <div className="col-12 col-md-3">
            <h6 
              className="fw-bold mb-3 small text-white" 
              style={{ letterSpacing: '1px', transition: "0.2s" }}
              onMouseOver={handleMouseOver} 
              onMouseOut={handleMouseOutTitle}
            >
              ENDEREÇO
            </h6>
            <p 
              className="small m-0 mb-1" 
              style={{ color: "rgba(255, 255, 255, 0.8)", transition: "0.2s" }}
              onMouseOver={handleMouseOver} 
              onMouseOut={handleMouseOut}
            >
              Rua Visconde de Ouro Preto, 410
            </p>
            <p 
              className="small m-0" 
              style={{ color: "rgba(255, 255, 255, 0.8)", transition: "0.2s" }}
              onMouseOver={handleMouseOver} 
              onMouseOut={handleMouseOut}
            >
              Centro - Florianópolis/SC
            </p>
          </div>

          <div className="col-12 col-md-3">
            <h6 
              className="fw-bold mb-3 small text-white" 
              style={{ letterSpacing: '1px', transition: "0.2s" }}
              onMouseOver={handleMouseOver} 
              onMouseOut={handleMouseOutTitle}
            >
              LINKS ÚTEIS
            </h6>
            <div className="d-flex flex-column gap-2">
              <a 
                href="#" 
                className="small text-decoration-none fw-medium" 
                style={{ color: "rgba(255, 255, 255, 0.8)", transition: "0.2s" }} 
                onMouseOver={handleMouseOver} 
                onMouseOut={handleMouseOut}
              >
                Portal Senac/SC
              </a>
              <a 
                href="#" 
                className="small text-decoration-none fw-medium" 
                style={{ color: "rgba(255, 255, 255, 0.8)", transition: "0.2s" }} 
                onMouseOver={handleMouseOver} 
                onMouseOut={handleMouseOut}
              >
                Privacidade (LGPD)
              </a>
            </div>
          </div>

          <div className="col-12 col-md-3">
            <h6 
              className="fw-bold mb-3 small text-white" 
              style={{ letterSpacing: '1px', transition: "0.2s" }}
              onMouseOver={handleMouseOver} 
              onMouseOut={handleMouseOutTitle}
            >
              REDES SOCIAIS
            </h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              {['facebook', 'instagram', 'linkedin', 'youtube'].map((social) => (
                <a 
                  key={social}
                  href={`https://${social}.com/senacsc`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "rgba(255, 255, 255, 0.8)", transition: "0.2s" }}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  <i className={`bi bi-${social} fs-4`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mb-5 mt-5">
          <Link to="/" className="text-decoration-none">
            <img 
              src={logoSenac} 
              alt="Logo Senac" 
              className="img-fluid" 
              style={{ maxWidth: "200px" }} 
            />
          </Link>
        </div>

        <div 
          className="row mt-5 pt-3" 
          style={{ borderTop: `3px solid ${laranjaSistema}` }} 
        >
          <div className="col-12 text-center mt-2">
            <p 
              className="m-0 small fw-medium" 
              style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.8rem", transition: "0.2s" }}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOutCopy}
            >
              © 2026 Senac • Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;