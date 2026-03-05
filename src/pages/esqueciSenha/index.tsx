import React, { useState } from "react";
import { Link } from "react-router-dom";
// Quando for conectar com o banco, basta descomentar a linha abaixo:
// import { solicitarRecuperacaoSenha } from '../../services/authService';

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  // Mantive a sua lógica de usar uma string para a mensagem de sucesso/erro
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      // Aqui entrará a sua chamada real para a API:
      // await solicitarRecuperacaoSenha(email);

      // Simulação temporária para você ver o alerta verde funcionando
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMensagem(
        "Se este e-mail estiver cadastrado, você receberá um link em instantes.",
      );
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao solicitar recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded p-4 shadow-sm w-100"
      style={{ backgroundColor: "#e9ecef" }}
    >
      {/* Logo clicável redirecionando para a Home */}
      <Link
        to="/"
        className="d-flex justify-content-center align-items-center gap-3 mb-4 mt-2 text-decoration-none"
      >
        <img
          src="/logo-abadeus.png"
          alt="Logo Abadeus Eventos"
          className="img-fluid"
          style={{ maxWidth: "60px" }}
        />
        <span
          className="fw-bold lh-1 text-dark text-start"
          style={{ fontSize: "1.6rem" }}
        >
          Abadeus <br /> Eventos
        </span>
      </Link>

      <h2 className="fs-5 mb-3 text-center text-dark fw-normal">
        Recuperar senha
      </h2>

      <p
        className="text-center text-dark mb-4 px-2"
        style={{ fontSize: "0.85rem" }}
      >
        Digite o e-mail cadastrado na sua conta e enviaremos um link para
        redefinição.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Campo E-mail */}
        <div className="mb-3 text-start">
          <label
            className="form-label text-dark mb-1"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            EMAIL
          </label>
          <input
            type="email"
            className="form-control rounded-1 py-2 shadow-none border-secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Alerta de Sucesso ou Erro (Lógica do seu código antigo!) */}
        {mensagem && (
          <div
            className={`alert ${mensagem.includes("Erro") ? "alert-danger" : "alert-success"} py-2 mb-4 text-center`}
            style={{ fontSize: "0.85rem" }}
          >
            {mensagem}
          </div>
        )}

        {/* Botão Enviar Link */}
        <div className="d-flex justify-content-center mb-4 px-4 mt-2">
          <button
            type="submit"
            className="btn text-white py-2 rounded-1 border-0 w-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#000134" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Enviando...
              </>
            ) : (
              "Enviar link"
            )}
          </button>
        </div>

        {/* Link para voltar ao login */}
        <div className="text-center mt-2">
          <Link
            to="/login"
            className="text-decoration-none text-secondary hover-dark"
            style={{ fontSize: "0.85rem" }}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Lembrei minha senha
          </Link>
        </div>
      </form>
    </div>
  );
}
