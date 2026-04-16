import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";

export default function ResetarSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Captura o token que veio no link do e-mail (?token=xyz)
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    senha: "",
    confirmarSenha: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Cores do Sistema
  const azulSistema = "#1453bd";
  const laranjaSistema = "#f19000";

  const isError = mensagem.includes("Erro");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      setMensagem("Erro: As senhas não coincidem.");
      return;
    }

    if (!token) {
      setMensagem("Erro: Token de recuperação ausente ou inválido.");
      return;
    }

    setLoading(true);
    setMensagem("");

    try {
      // Chamada real para o Back-end
      await authService.resetarSenha(token, formData.senha);
      
      setMensagem("Senha alterada com sucesso! Redirecionando para o login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: any) {
      const msg = error.response?.data?.mensagem || "Erro ao redefinir senha. O link pode ter expirado.";
      setMensagem("Erro: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-4 p-md-5 rounded-4 shadow-lg w-100 mx-auto"
      style={{ backgroundColor: "#ffffff", maxWidth: "450px", border: "1px solid #f1f5f9" }}
    >
      {/* LOGO INSERIDO AQUI (Seguindo o padrão do Login e Esqueci Senha) */}
      <Link
        to="/"
        className="d-flex justify-content-center align-items-center mb-4 text-decoration-none"
      >
        <img
          src="/logos-senac-extended.png"
          alt="logo do senac"
          className="img-fluid"
          style={{ maxWidth: "180px" }} 
        />
      </Link>

      <div className="text-center mb-4">
        <h2 className="fs-4 fw-bold mb-1" style={{ color: azulSistema }}>
          Nova Senha
        </h2>
        <p className="text-muted small">
          Crie uma nova senha para acessar sua conta.
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
        {/* CAMPO: NOVA SENHA */}
        <div className="mb-3 text-start">
          <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>
            NOVA SENHA
          </label>
          <div className="input-group">
            <input
              type={mostrarSenha ? "text" : "password"}
              className="form-control rounded-start-3 py-2 px-3 shadow-none border-end-0"
              style={{ border: "1px solid #cbd5e1" }}
              placeholder="••••••••"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              disabled={loading || (!isError && mensagem !== "")}
              required
            />
            <span
              className="input-group-text bg-white border-start-0 rounded-end-3"
              style={{ cursor: "pointer", border: "1px solid #cbd5e1" }}
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              <i className={`bi ${mostrarSenha ? "bi-eye-slash text-muted" : "bi-eye"}`} style={{ color: azulSistema }}></i>
            </span>
          </div>
        </div>

        {/* CAMPO: CONFIRMAR SENHA */}
        <div className="mb-4 text-start">
          <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>
            CONFIRMAR NOVA SENHA
          </label>
          <div className="input-group">
            <input
              type={mostrarSenha ? "text" : "password"}
              className="form-control rounded-start-3 py-2 px-3 shadow-none border-end-0"
              style={{ border: "1px solid #cbd5e1" }}
              placeholder="••••••••"
              value={formData.confirmarSenha}
              onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
              disabled={loading || (!isError && mensagem !== "")}
              required
            />
             {/* Adicionado o ícone de olho também no confirmar senha por UX */}
             <span
              className="input-group-text bg-white border-start-0 rounded-end-3"
              style={{ cursor: "pointer", border: "1px solid #cbd5e1" }}
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              <i className={`bi ${mostrarSenha ? "bi-eye-slash text-muted" : "bi-eye"}`} style={{ color: azulSistema }}></i>
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="btn text-white py-2 fw-bold rounded-3 w-100 border-0 mb-4"
          style={{ 
            backgroundColor: azulSistema,
            boxShadow: `0 4px 12px rgba(20, 83, 189, 0.2)`
          }}
          disabled={loading || (!isError && mensagem !== "")}
        >
          {loading ? (
            <div className="d-flex align-items-center justify-content-center">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Salvando...
            </div>
          ) : (
            "Redefinir Senha"
          )}
        </button>

        <div className="text-center mt-2 pt-3 border-top">
          <Link to="/login" className="text-decoration-none fw-bold" style={{ color: laranjaSistema, fontSize: "0.9rem" }}>
            Voltar para o login
          </Link>
        </div>
      </form>
    </div>
  );
}