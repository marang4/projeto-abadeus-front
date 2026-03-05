import React, { useState } from "react";
// Correção: o import correto costuma ser 'react-router-dom'
import { Link, useNavigate } from "react-router-dom";

export default function Cadastro() {
  const navigate = useNavigate();

  // Agrupando todos os campos em um único estado para facilitar o gerenciamento
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Função genérica que atualiza qualquer campo que o usuário digitar
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulação de tempo de requisição para a API
    setTimeout(() => {
      setIsLoading(false);
      // Após cadastrar, joga o usuário de volta para a tela de login
      navigate("/login");
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

      <h2 className="fs-5 mb-4 text-center text-dark fw-normal">
        Crie sua conta
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Campo Nome */}
        <div className="mb-3 text-start">
          <label
            className="form-label text-dark mb-1"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            NOME COMPLETO
          </label>
          <input
            name="nome"
            type="text"
            className="form-control rounded-1 py-2 shadow-none border-secondary"
            value={formData.nome}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        {/* Agrupando CPF e Telefone lado a lado em telas maiores */}
        <div className="row mb-3">
          <div className="col-12 col-md-6 text-start mb-3 mb-md-0">
            <label
              className="form-label text-dark mb-1"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              CPF
            </label>
            <input
              name="cpf"
              type="text"
              className="form-control rounded-1 py-2 shadow-none border-secondary"
              value={formData.cpf}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          <div className="col-12 col-md-6 text-start">
            <label
              className="form-label text-dark mb-1"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              TELEFONE
            </label>
            <input
              name="telefone"
              type="text"
              className="form-control rounded-1 py-2 shadow-none border-secondary"
              value={formData.telefone}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Campo Email */}
        <div className="mb-3 text-start">
          <label
            className="form-label text-dark mb-1"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            EMAIL
          </label>
          <input
            name="email"
            type="email"
            className="form-control rounded-1 py-2 shadow-none border-secondary"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        {/* Campo Senha */}
        <div className="mb-4 text-start">
          <label
            className="form-label text-dark mb-1"
            style={{ fontSize: "0.8rem", fontWeight: 500 }}
          >
            SENHA
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

        {/* Botão Cadastrar */}
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
                Cadastrando...
              </>
            ) : (
              "Cadastrar"
            )}
          </button>
        </div>

        {/* Link para voltar ao Login */}
        <div
          className="text-center text-dark mt-2"
          style={{ fontSize: "0.85rem" }}
        >
          <span>Já possui uma conta? </span>
          <br />
          <Link
            to="/login"
            className="text-decoration-none"
            style={{ color: "#00a1b8", fontSize: "0.95rem" }}
          >
            Faça login
          </Link>
        </div>
      </form>
    </div>
  );
}
