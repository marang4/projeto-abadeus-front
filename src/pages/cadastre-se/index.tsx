import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Cadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // --- FUNÇÕES DE MÁSCARA ---
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "") // Tira tudo que não é número
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o primeiro ponto
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o segundo ponto
      .replace(/(\d{3})(\d{1,2})/, "$1-$2") // Coloca o traço
      .replace(/(-\d{2})\d+?$/, "$1"); // Impede de digitar mais que 11 números
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "") // Tira tudo que não é número
      .replace(/(\d{2})(\d)/, "($1) $2") // Coloca parênteses em volta do DDD
      .replace(/(\d{5})(\d)/, "$1-$2") // Coloca o traço depois do 9
      .replace(/(-\d{4})\d+?$/, "$1"); // Impede de digitar mais números que o permitido
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name; // Como o nome do campo não muda, usamos const
    let value = event.target.value; // Como o valor vai receber a máscara, usamos let

    // Se for CPF ou Telefone, aplica a máscara antes de salvar no state
    if (name === "cpf") value = maskCPF(value);
    if (name === "telefone") value = maskPhone(value);

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const [ano, mes, dia] = formData.dataNascimento.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const payload = {
        nome: formData.nome,
        // O Java limpa a máscara lá no backend com o replaceAll("\\D", ""), então
        // podemos mandar com a máscara mesmo que ele se vira perfeitamente!
        telefone: formData.telefone,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf,
        dataNascimento: dataFormatada,
      };

      await api.post("/clientes", payload);

      setSuccessMessage("Conta criada com sucesso! Redirecionando...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 400 || error.response?.status === 404) {
        const dadosErro = error.response.data;
        let mensagemAmigavel =
          "Erro ao criar conta. Verifique os dados informados.";

        if (typeof dadosErro === "string") {
          mensagemAmigavel = dadosErro;
        } else if (dadosErro && typeof dadosErro === "object") {
          mensagemAmigavel =
            dadosErro.mensagem || dadosErro.message || mensagemAmigavel;
        }

        setErrorMessage(mensagemAmigavel);
      } else {
        setErrorMessage(
          "Erro de conexão com o servidor. Tente novamente mais tarde.",
        );
      }
    } finally {
      setIsLoading(false);
    }
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

      {errorMessage && (
        <div
          className="alert alert-danger text-center p-2 mb-3"
          style={{ fontSize: "0.85rem" }}
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          className="alert alert-success text-center p-2 mb-3"
          style={{ fontSize: "0.85rem" }}
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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
            disabled={isLoading || successMessage !== ""}
            required
          />
        </div>

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
              maxLength={14} // Limita o tamanho máximo visual
              placeholder="000.000.000-00"
              className="form-control rounded-1 py-2 shadow-none border-secondary"
              value={formData.cpf}
              onChange={handleChange}
              disabled={isLoading || successMessage !== ""}
              required
            />
          </div>
          <div className="col-12 col-md-6 text-start">
            <label
              className="form-label text-dark mb-1"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              DATA DE NASCIMENTO
            </label>
            <input
              name="dataNascimento"
              type="date"
              className="form-control rounded-1 py-2 shadow-none border-secondary"
              value={formData.dataNascimento}
              onChange={handleChange}
              disabled={isLoading || successMessage !== ""}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-6 text-start mb-3 mb-md-0">
            <label
              className="form-label text-dark mb-1"
              style={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              EMAIL
            </label>
            <input
              name="email"
              type="email"
              placeholder="seu@email.com"
              className="form-control rounded-1 py-2 shadow-none border-secondary"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading || successMessage !== ""}
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
              maxLength={15} // Limita o tamanho máximo visual
              placeholder="(00) 00000-0000"
              className="form-control rounded-1 py-2 shadow-none border-secondary"
              value={formData.telefone}
              onChange={handleChange}
              disabled={isLoading || successMessage !== ""}
              required
            />
          </div>
        </div>

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
              disabled={isLoading || successMessage !== ""}
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

        <div className="d-flex justify-content-center mb-4 px-4">
          <button
            type="submit"
            className="btn text-white py-2 rounded-1 border-0 w-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#000134" }}
            disabled={isLoading || successMessage !== ""}
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
