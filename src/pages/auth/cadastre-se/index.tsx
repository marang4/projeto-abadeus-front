import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClienteService } from "../../../services/clienteService";

const CadastroClientePage = () => {
  const navigate = useNavigate();
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  const azulSistema = "#1453bd";
  const laranjaSistema = "#f19000";

  const maskCPF = (value: string) => value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");
  const maskPhone = (value: string) => value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").replace(/(-\d{4})\d+?$/, "$1");
  const maskDate = (value: string) => value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{4})\d+?$/, "$1");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    let value = event.target.value;

    if (name === "cpf") value = maskCPF(value);
    if (name === "telefone") value = maskPhone(value);
    if (name === "dataNascimento") value = maskDate(value);

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCalendarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = event.target.value;
    if (!rawDate) return;

    const [year, month, day] = rawDate.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    
    setFormData((prevState) => ({ ...prevState, dataNascimento: formattedDate }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const dateParts = formData.dataNascimento.split('/');
      const unmaskedDate = dateParts.length === 3 ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` : formData.dataNascimento;

      const payload = {
        nome: formData.nome,
        telefone: formData.telefone.replace(/\D/g, ""),
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf.replace(/\D/g, ""),
        dataNascimento: unmaskedDate,
      };

      await ClienteService.criarCliente(payload);
      setSuccessMessage("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      const mensagemDoBackend = error.response?.data?.mensagem || error.response?.data?.message || error.response?.data;
      setErrorMessage(typeof mensagemDoBackend === 'string' ? mensagemDoBackend : "Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light w-100 py-5">
      <div 
        className="p-4 p-md-5 rounded-4 shadow-lg w-100 mx-auto" 
        style={{ 
          backgroundColor: "#ffffff", 
          maxWidth: "650px", 
          border: "1px solid #f1f5f9" 
        }}
      >
        <Link to="/" className="d-flex justify-content-center mb-4 text-decoration-none">
          <img src="/logos-senac-extended.png" alt="logo senac" className="img-fluid" style={{ maxWidth: "160px" }} />
        </Link>

        <div className="text-center mb-4">
          <h2 className="fs-4 fw-bold mb-1" style={{ color: azulSistema }}>Crie sua conta</h2>
          <p className="text-muted small">Preencha os dados abaixo para se cadastrar</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger text-center border-0 p-2 mb-3" style={{ fontSize: "0.85rem", backgroundColor: "#fef2f2", color: "#991b1b" }}>
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="alert alert-success text-center border-0 p-2 mb-3" style={{ fontSize: "0.85rem", backgroundColor: "#ecfdf5", color: "#065f46" }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>NOME COMPLETO</label>
            <input name="nome" type="text" className="form-control rounded-3 py-2 px-3 shadow-none" style={{ border: "1px solid #cbd5e1" }} value={formData.nome} onChange={handleChange} disabled={isLoading || !!successMessage} required />
          </div>

          <div className="row mb-3">
            <div className="col-12 col-md-6 text-start mb-3 mb-md-0">
              <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>CPF</label>
              <input name="cpf" type="text" maxLength={14} placeholder="000.000.000-00" className="form-control rounded-3 py-2 px-3 shadow-none" style={{ border: "1px solid #cbd5e1" }} value={formData.cpf} onChange={handleChange} disabled={isLoading || !!successMessage} required />
            </div>
            
            <div className="col-12 col-md-6 text-start">
              <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>DATA DE NASCIMENTO</label>
              <div className="input-group">
                <input
                  name="dataNascimento"
                  type="text"
                  maxLength={10}
                  placeholder="dd/mm/aaaa"
                  className="form-control rounded-start-3 py-2 px-3 shadow-none border-end-0"
                  style={{ border: "1px solid #cbd5e1" }}
                  value={formData.dataNascimento}
                  onChange={handleChange}
                  disabled={isLoading || !!successMessage}
                  required
                />
                <span
                  className="input-group-text bg-white border-start-0 rounded-end-3"
                  style={{ cursor: "pointer", border: "1px solid #cbd5e1" }}
                  onClick={() => dateInputRef.current?.showPicker()}
                >
                  <i className="bi bi-calendar3" style={{ color: azulSistema }}></i>
                </span>
                <input
                  ref={dateInputRef}
                  type="date"
                  style={{ position: "absolute", visibility: "hidden", width: 0, height: 0 }}
                  onChange={handleCalendarChange}
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12 col-md-6 text-start mb-3 mb-md-0">
              <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>E-MAIL</label>
              <input name="email" type="email" placeholder="seu@email.com" className="form-control rounded-3 py-2 px-3 shadow-none" style={{ border: "1px solid #cbd5e1" }} value={formData.email} onChange={handleChange} disabled={isLoading || !!successMessage} required />
            </div>
            <div className="col-12 col-md-6 text-start">
              <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>TELEFONE</label>
              <input name="telefone" type="text" maxLength={15} placeholder="(00) 00000-0000" className="form-control rounded-3 py-2 px-3 shadow-none" style={{ border: "1px solid #cbd5e1" }} value={formData.telefone} onChange={handleChange} disabled={isLoading || !!successMessage} required />
            </div>
          </div>

          <div className="mb-4 text-start">
            <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.85rem", color: "#475569" }}>SENHA</label>
            <div className="input-group">
              <input name="senha" type={mostrarSenha ? "text" : "password"} className="form-control rounded-start-3 py-2 px-3 shadow-none border-end-0" style={{ border: "1px solid #cbd5e1" }} placeholder="••••••••" value={formData.senha} onChange={handleChange} disabled={isLoading || !!successMessage} required />
              <span className="input-group-text bg-white border-start-0 rounded-end-3" style={{ cursor: "pointer", border: "1px solid #cbd5e1" }} onClick={() => setMostrarSenha(!mostrarSenha)}>
                <i className={`bi ${mostrarSenha ? "bi-eye-slash text-muted" : "bi-eye"}`} style={{ color: azulSistema }}></i>
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-center mb-4 mt-4">
            <button
              type="submit"
              className="btn text-white py-2 px-5 fw-bold rounded-3 border-0"
              style={{ 
                backgroundColor: azulSistema, 
                boxShadow: `0 4px 12px rgba(20, 83, 189, 0.2)` 
              }}
              disabled={isLoading || !!successMessage}
            >
              {isLoading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <span className="spinner-border spinner-border-sm me-2"></span> Cadastrando...
                </div>
              ) : "Finalizar Cadastro"}
            </button>
          </div>

          <div className="text-center mt-2 pt-3 border-top" style={{ fontSize: "0.9rem" }}>
            <span className="text-muted">Já possui uma conta?</span><br />
            <Link to="/login" className="text-decoration-none fw-bold" style={{ color: laranjaSistema }}>Fazer login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroClientePage;