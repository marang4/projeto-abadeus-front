import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface LoginRequest {
  documento: string;
  senha: string;
}

export function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginRequest>({
    documento: "",
    senha: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div
      className="rounded p-4 shadow-sm w-100"
      style={{ backgroundColor: "#e9ecef" }}
    >
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

      {/* Título com fonte mais fina (fw-normal) para ficar elegante */}
      <h2 className="fs-5 mb-4 text-center text-dark fw-normal">
        Faça login na sua conta
        <br />
        para continuar
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Campo Login */}
        <div className="mb-3 text-start">
          <label
            className="form-label text-dark mb-1"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            Email
          </label>
          <input
            name="documento"
            type="text"
            className="form-control rounded-1 py-2 shadow-none border-secondary"
            value={formData.documento}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        {/* Campo Senha */}
        <div className="mb-1 text-start">
          <label
            className="form-label text-dark mb-1"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            Senha
          </label>
          <div className="input-group">
            <input
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              className="form-control rounded-start-1 py-2 shadow-none border-secondary border-end-0"
              value={formData.senha}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            <span
              className="input-group-text bg-white border-secondary border-start-0 rounded-end-1"
              style={{ cursor: "pointer" }}
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              <i
                className={`bi ${mostrarSenha ? "bi-eye-slash text-muted" : "bi-eye text-dark"}`}
              ></i>
            </span>
          </div>
        </div>

        {/* Esqueci minha senha */}
        <div className="text-end mb-4">
          <Link
            to="/esqueci-senha"
            className="text-dark text-decoration-none"
            style={{ fontSize: "0.8rem" }}
          >
            Esqueci minha senha
          </Link>
        </div>

        {/* Botão Entrar mais largo (w-100) com um respiro lateral (px-4) */}
        <div className="d-flex justify-content-center mb-4 px-4">
          <button
            type="submit"
            className="btn text-white py-2 rounded-1 border-0 w-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#000134" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </div>

        {/* Criar Conta */}
        <div
          className="text-center text-dark mt-2"
          style={{ fontSize: "0.85rem" }}
        >
          <span>É novo por aqui? </span>
          <br />
          <Link
            to="/cadastro"
            className="text-decoration-none"
            style={{ color: "#00a1b8", fontSize: "0.95rem" }}
          >
            Criar minha conta
          </Link>
        </div>
      </form>
    </div>
  );
}
