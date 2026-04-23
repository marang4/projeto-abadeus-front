import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // Ajuste o path se necessário

interface LoginRequest {
  documento: string;
  senha: string;
}

const Login: React.FC = () => {
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

  // Cores do Sistema
  const azulSistema = "#1453bd";
  const laranjaSistema = "#f19000";

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

      if (status === 403 || (typeof mensagemDoBackend === 'string' && mensagemDoBackend.toLowerCase().includes("inativa"))) {
        setErrorMessage(mensagemDoBackend || "Sua conta precisa de ativação. Verifique seu e-mail.");
      } else if (mensagemDoBackend && typeof mensagemDoBackend === 'string') {
        setErrorMessage(mensagemDoBackend);
      } else {
        setErrorMessage("E-mail ou senha incorretos.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light w-100">
      <div
        className="p-4 p-md-5 rounded-4 shadow-lg w-100 mx-auto"
        style={{ 
          backgroundColor: "#ffffff", 
          maxWidth: "450px", 
          border: `1px solid #f1f5f9` 
        }}
      >
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
            Seja bem-vindo
          </h2>
          <p className="text-muted small">Faça o login para ter acesso à sua conta</p>
        </div>

        {successMessage && (
          <div className="alert alert-success text-center border-0 p-2 mb-3" style={{ fontSize: "0.85rem", backgroundColor: "#ecfdf5", color: "#065f46" }}>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger text-center border-0 p-2 mb-3" style={{ fontSize: "0.85rem", backgroundColor: "#fef2f2", color: "#991b1b" }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>
              E-mail
            </label>
            <input
              name="documento"
              type="email"
              className="form-control rounded-3 py-2 px-3 shadow-none"
              style={{ border: "1px solid #cbd5e1" }}
              placeholder="exemplo@email.com"
              value={formData.documento}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>
              Senha
            </label>
            <div className="input-group">
              <input
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                className="form-control rounded-start-3 py-2 px-3 shadow-none border-end-0"
                style={{ border: "1px solid #cbd5e1" }}
                placeholder="••••••••"
                value={formData.senha}
                onChange={handleChange}
                disabled={isLoading}
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

          <div className="text-end mb-4">
            <Link
              to="/esqueci-senha"
              className="text-decoration-none fw-medium"
              style={{ fontSize: "0.8rem", color: azulSistema }}
            >
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            className="btn text-white py-2 fw-bold rounded-3 w-100 border-0 mb-4"
            style={{ 
              backgroundColor: azulSistema,
              boxShadow: `0 4px 12px rgba(20, 83, 189, 0.2)`
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="d-flex align-items-center justify-content-center">
                <span className="spinner-border spinner-border-sm me-2"></span>
                Acessando...
              </div>
            ) : (
              "Entrar na Conta"
            )}
          </button>

          <div className="text-center mt-2 pt-3 border-top" style={{ fontSize: "0.9rem" }}>
            <span className="text-muted">Não possui uma conta?</span>
            <br />
            <Link
              to="/cadastro"
              className="text-decoration-none fw-bold"
              style={{ color: laranjaSistema }}
            >
              Cadastre-se agora
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;