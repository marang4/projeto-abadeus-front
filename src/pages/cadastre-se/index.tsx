import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClienteService } from "../../services/clienteService";

function CadastroClientePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    tipoCliente: "NORMAL" as "NORMAL" | "ALUNO",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = event.target.name;
    let value = event.target.value;

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

      // Payload estritamente tipado conforme a interface do Service
      const payload: ClienteRequestDTO = {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf,
        dataNascimento: dataFormatada,
        tipoCliente: formData.tipoCliente,
      };

      // Componente cego sobre qual é o endpoint. Quem sabe disso é o Service.
      await ClienteService.criarCliente(payload);

      setSuccessMessage("Conta criada com sucesso! Redirecionando...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      if (error.response?.status === 400 || error.response?.status === 404 || error.response?.status === 409) {
        const dadosErro = error.response.data;
        let mensagemAmigavel = "Erro ao criar conta. Verifique os dados informados.";

        if (typeof dadosErro === "string") {
          mensagemAmigavel = dadosErro;
        } else if (dadosErro && typeof dadosErro === "object") {
          mensagemAmigavel = dadosErro.mensagem || dadosErro.message || mensagemAmigavel;
        }

        setErrorMessage(mensagemAmigavel);
      } else {
        setErrorMessage("Erro de conexão com o servidor. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded p-4 shadow-sm w-100" style={{ backgroundColor: "#e9ecef" }}>
      <Link to="/" className="d-flex justify-content-center align-items-center gap-3 mb-4 mt-2 text-decoration-none">
        <img src="/logos-senac-extended.png" alt="logo senac" className="img-fluid" style={{ maxWidth: "120px" }} />
      </Link>

      <h2 className="fs-5 mb-4 text-center text-dark fw-normal">
        Crie sua conta
      </h2>

      {errorMessage && (
        <div className="alert alert-danger text-center p-2 mb-3" style={{ fontSize: "0.85rem" }}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success text-center p-2 mb-3" style={{ fontSize: "0.85rem" }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-start">
          <label className="form-label text-dark mb-1" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
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
            <label className="form-label text-dark mb-1" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              CPF
            </label>
            <input
              name="cpf"
              type="text"
              maxLength={14}
              placeholder="000.000.000-00"
              className="form-control rounded-1 py-2 shadow-none border-secondary"
              value={formData.cpf}
              onChange={handleChange}
              disabled={isLoading || successMessage !== ""}
              required
            />
          </div>
          <div className="col-12 col-md-6 text-start">
            <label className="form-label text-dark mb-1" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
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
            <label className="form-label text-dark mb-1" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
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
            <label className="form-label text-dark mb-1" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              TELEFONE
            </label>
            <input
              name="telefone"
              type="text"
              maxLength={15}
              placeholder="(00) 00000-0000"
              className="form-control rounded-1 py-2 shadow-none border-secondary"
              value={formData.telefone}
              onChange={handleChange}
              disabled={isLoading || successMessage !== ""}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-6 text-start mb-3 mb-md-0">
            <label className="form-label text-dark mb-1" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
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
                <i className={`bi ${mostrarSenha ? "bi-eye-slash text-muted" : "bi-eye text-dark"}`}></i>
              </span>
            </div>
          </div>
          <div className="col-12 col-md-6 text-start">
            <label className="form-label text-dark mb-1" style={{ fontSize: "0.8rem", fontWeight: 500 }}>
              TIPO DE CONTA
            </label>
            <select
              name="tipoCliente"
              className="form-select rounded-1 py-2 shadow-none border-secondary"
              value={formData.tipoCliente}
              onChange={handleChange}
              disabled={isLoading || successMessage !== ""}
            >
              <option value="NORMAL">Cliente Normal</option>
              <option value="ALUNO">Aluno</option>
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-center mb-4 px-4 mt-4">
          <button
            type="submit"
            className="btn text-white py-2 rounded-1 border-0 w-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#1D376C" }}
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

        <div className="text-center text-dark mt-2" style={{ fontSize: "0.85rem" }}>
          <span>Já possui uma conta? </span>
          <br />
          <Link to="/login" className="text-decoration-none" style={{ color: "#00a1b8", fontSize: "0.95rem" }}>
            Faça login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CadastroClientePage;