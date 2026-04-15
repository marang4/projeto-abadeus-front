import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface LoginRequest {
  documento: string;
  senha: string;
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState<LoginRequest>({
    documento: "",
    senha: "",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Lê a URL caso o usuário venha do redirecionamento do e-mail
  useEffect(() => {
    const sucesso = searchParams.get("sucesso");
    const erro = searchParams.get("erro");

    if (sucesso === "email-confirmado") {
      setSuccessMessage("E-mail confirmado com sucesso! Você já pode entrar.");
    }
    if (erro === "token-invalido") {
      setErrorMessage("O link de confirmação é inválido ou já expirou.");
    }
  }, [searchParams]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      await login({
        email: formData.documento,
        senha: formData.senha,
      });

      navigate("/");
    } catch (error: any) {
      const status = error.response?.status;
      const mensagemDoBackend = error.response?.data?.message || error.response?.data;

      // Captura o erro específico da conta inativa (enviado pelo AuthService do Java)
      if (status === 403 || (typeof mensagemDoBackend === 'string' && mensagemDoBackend.toLowerCase().includes("inativa"))) {
        setErrorMessage(mensagemDoBackend || "Sua conta precisa de ativação. Verifique seu e-mail.");
      } 
      // Exibe qualquer outra RegraDeNegocioException
      else if (mensagemDoBackend && typeof mensagemDoBackend === 'string') {
        setErrorMessage(mensagemDoBackend);
      } 
      // Fallback padrão
      else {
        setErrorMessage("E-mail ou senha incorretos.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="rounded p-4 shadow-sm w-100 mx-auto"
      style={{ backgroundColor: "#e9ecef", maxWidth: "450px" }}
    >
      <Link
        to="/"
        className="d-flex justify-content-center align-items-center gap-3 mb-4 mt-2 text-decoration-none"
      >
        <img
          src="/logos-senac-extended.png"
          alt="logo do senac"
          className="img-fluid"
          style={{ maxWidth: "120px" }}
        />
      </Link>

      <h2 className="fs-5 mb-4 text-center text-dark fw-normal">
        Faça login na sua conta
        <br />
        para continuar
      </h2>

      {successMessage && (
        <div
          className="alert alert-success text-center p-2 mb-3"
          style={{ fontSize: "0.85rem" }}
        >
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          className="alert alert-danger text-center p-2 mb-3"
          style={{ fontSize: "0.85rem" }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <div className="text-end mb-4">
          <Link
            to="/esqueci-senha"
            className="text-dark text-decoration-none"
            style={{ fontSize: "0.8rem" }}
          >
            Esqueci minha senha
          </Link>
        </div>

        <div className="d-flex justify-content-center mb-4 px-4">
          <button
            type="submit"
            className="btn text-white py-2 rounded-1 border-0 w-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#1D376C" }}
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