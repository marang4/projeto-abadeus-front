import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const azulSistema = "#1453bd";
  const laranjaSistema = "#f19000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      await authService.solicitarRecuperacaoSenha(email);
      setMensagem("Se este e-mail estiver cadastrado, você receberá um link em instantes.");
    } catch (error: any) {
      const mensagemDoBackend = error.response?.data?.mensagem || error.response?.data?.message || error.response?.data;
      
      if (mensagemDoBackend && typeof mensagemDoBackend === 'string') {
        setMensagem("Erro: " + mensagemDoBackend);
      } else {
        setMensagem("Erro ao solicitar recuperação. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isError = mensagem.includes("Erro");

  return (
    <div
      className="p-4 p-md-5 rounded-4 shadow-lg w-100 mx-auto"
      style={{ backgroundColor: "#ffffff", maxWidth: "450px", border: "1px solid #f1f5f9" }}
    >
      <Link to="/" className="d-flex justify-content-center mb-4 text-decoration-none">
        <img
          src="/logos-senac-extended.png"
          alt="logo senac"
          className="img-fluid"
          style={{ maxWidth: "160px" }}
        />
      </Link>

      <div className="text-center mb-4">
        <h2 className="fs-4 fw-bold mb-2" style={{ color: azulSistema }}>
          Recuperar senha
        </h2>
        <p className="text-muted small px-2">
          Digite seu e-mail cadastrado e enviaremos as instruções para criar uma nova senha.
        </p>
      </div>

      {mensagem && (
        <div
          className="alert border-0 p-2 mb-4 text-center"
          style={{ 
            fontSize: "0.85rem", 
            backgroundColor: isError ? "#fef2f2" : "#ecfdf5", 
            color: isError ? "#991b1b" : "#065f46" 
          }}
        >
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4 text-start">
          <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>
            E-MAIL
          </label>
          <input
            type="email"
            className="form-control rounded-3 py-2 px-3 shadow-none"
            style={{ border: "1px solid #cbd5e1" }}
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || (!isError && mensagem !== "")}
            required
          />
        </div>

        <button
          type="submit"
          className="btn text-white py-2 fw-bold rounded-3 w-100 border-0 mb-4"
          style={{ backgroundColor: azulSistema, boxShadow: `0 4px 12px rgba(20, 83, 189, 0.2)` }}
          disabled={loading || (!isError && mensagem !== "")}
        >
          {loading ? (
            <div className="d-flex align-items-center justify-content-center">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Enviando...
            </div>
          ) : (
            "Enviar link de recuperação"
          )}
        </button>

        <div className="text-center mt-2 pt-3 border-top">
          <Link to="/login" className="text-decoration-none fw-bold" style={{ color: laranjaSistema, fontSize: "0.9rem" }}>
            <i className="bi bi-arrow-left me-2"></i>
            Voltar para o login
          </Link>
        </div>
      </form>
    </div>
  );
}