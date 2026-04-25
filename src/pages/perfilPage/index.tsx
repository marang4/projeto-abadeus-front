import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../services/api";
import Footer from "../../components/footer";
import ConfirmModal from "../../components/confirmModal";
import Modal from "../../components/Modal"; // Importando seu modal customizado
import { ClienteService } from "../../services/clienteService";

const PerfilPage = () => {
  const [usuario, setUsuario] = useState({ id: null, nome: "", email: "", cpf: "", telefone: "", dataNascimento: "", urlDocumento: "" });
  const [endereco, setEndereco] = useState({ id: null, cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "" });
  const [senhas, setSenhas] = useState({ senhaAtual: "", novaSenha: "", confirmaSenha: "" });

  const [filiacao, setFiliacao] = useState({
    pai: { id: null, nome: "", cpf: "", telefone: "" },
    mae: { id: null, nome: "", cpf: "", telefone: "" }
  });
  const [quemBusca, setQuemBusca] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [showDocModal, setShowDocModal] = useState(false);
  const [showSenhaModal, setShowSenhaModal] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "danger" });
  const [modalConfig, setModalConfig] = useState({ show: false, message: "", title: "Sucesso!", variant: "success" as const });

  const [openEndereco, setOpenEndereco] = useState(false);
  const [openResponsaveis, setOpenResponsaveis] = useState(false);

  const senacAzul = "#1453bd";
  const senacLaranja = "#f19000";

  const showToast = (message: string, type: "danger" | "warning" = "danger") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 5000);
  };

  const showSuccessModal = (message: string) => {
    setModalConfig({ show: true, message, title: "Sucesso!", variant: "success" });
  };

  const maskCpf = (value: string) => value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})/, "$1-$2").replace(/(-\d{2})\d+?$/, "$1");

  const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length <= 10) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/(-\d{4})\d+?$/, "$1");
  };

  const maskCep = (value: string) => {
    const v = value.replace(/\D/g, "");
    return v.length > 5 ? v.replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9) : v;
  };

  const carregarDados = async () => {
    try {
      const resAuth = await api.get("/auth/me");
      const userAuth = resAuth.data;
      if (!userAuth || !userAuth.id) return;

      const d = await ClienteService.buscarPorId(userAuth.id);

      setUsuario({
        id: d.id as any,
        nome: d.nome || userAuth.nome || "",
        email: d.email || userAuth.email || "",
        cpf: maskCpf(d.cpf || ""),
        telefone: maskPhone(d.telefone || ""),
        dataNascimento: d.dataNascimento || "",
        urlDocumento: d.urlDocumento || ""
      });

      if (d.responsaveis && d.responsaveis.length >= 2) {
        setFiliacao({ pai: { ...d.responsaveis[0], cpf: maskCpf(d.responsaveis[0].cpf), telefone: maskPhone(d.responsaveis[0].telefone) }, mae: { ...d.responsaveis[1], cpf: maskCpf(d.responsaveis[1].cpf), telefone: maskPhone(d.responsaveis[1].telefone) } });
      } else if (d.responsaveis && d.responsaveis.length === 1) {
        setFiliacao({ pai: { ...d.responsaveis[0], cpf: maskCpf(d.responsaveis[0].cpf), telefone: maskPhone(d.responsaveis[0].telefone) }, mae: { id: null, nome: "", cpf: "", telefone: "" } });
      }

      if (d.responsaveisBuscar) setQuemBusca(d.responsaveisBuscar.map((r: any) => ({ ...r, cpf: maskCpf(r.cpf), telefone: maskPhone(r.telefone) })));
      if (d.endereco) setEndereco({ id: d.endereco.id as any, cep: maskCep(d.endereco.cep || ""), logradouro: d.endereco.logradouro || "", numero: d.endereco.numero || "", complemento: d.endereco.complemento || "", bairro: d.endereco.bairro || "", cidade: d.endereco.cidade || "", uf: d.endereco.uf || "" });
    } catch (e) {
      console.error("Erro ao carregar perfil:", e);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const isMenor = () => {
    if (!usuario.dataNascimento) return false;
    const dataNascimento = new Date(usuario.dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) idade--;
    return idade < 18;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const salvarDocumentoModal = async () => {
    if (!usuario.id || !selectedFile) return;
    setIsUploadingDoc(true);
    try {
      await ClienteService.atualizarDocumento(usuario.id, selectedFile);
      setSelectedFile(null);
      await carregarDados(); 
      showSuccessModal("Documento anexado com sucesso!");
      setShowDocModal(false);
    } catch (error: any) {
      if (axios.isAxiosError(error)) showToast(error.response?.data?.message || "Erro ao salvar documento.", "danger");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const deletarDocumento = async () => {
    if (!usuario.id) return;
    if (!window.confirm("Tem certeza que deseja excluir o documento atual?")) return;
    
    setIsUploadingDoc(true);
    try {
      await api.delete(`/clientes/${usuario.id}/documento`);
      await carregarDados();
      showSuccessModal("Documento excluído com sucesso.");
      setShowDocModal(false);
    } catch (error: any) {
      showToast("Erro ao excluir documento.", "danger");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const addResponsavelBuscar = () => quemBusca.length < 3 && setQuemBusca([...quemBusca, { nome: "", cpf: "", telefone: "" }]);

  const updateResponsavelBuscar = (index: number, field: string, value: string) => {
    const novaLista = [...quemBusca];
    if (field === 'cpf') value = maskCpf(value);
    if (field === 'telefone') value = maskPhone(value);
    novaLista[index][field] = value;
    setQuemBusca(novaLista);
  };

  const removerResponsavelBuscar = (index: number) => setQuemBusca(quemBusca.filter((_, i) => i !== index));

  const buscarCep = async (cepBusca: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepBusca}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setEndereco((prev) => ({ ...prev, logradouro: data.logradouro || "", bairro: data.bairro || "", cidade: data.localidade || "", uf: data.uf || "" }));
        if (!data.logradouro) showToast("CEP localizado, mas você precisa preencher o logradouro e bairro manualmente.", "warning");
      } else {
        showToast("CEP não encontrado.", "warning");
      }
    } catch {
      showToast("Erro ao consultar o ViaCEP.", "danger");
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setEndereco({ ...endereco, cep: maskCep(e.target.value) });
    if (rawValue.length === 8) buscarCep(rawValue);
  };

  const salvarDadosCliente = async () => {
    if (!usuario.id) return;
    try {
      const payload = {
        nome: usuario.nome,
        telefone: usuario.telefone,
        responsaveis: isMenor() ? [filiacao.pai, filiacao.mae].filter(r => r.nome || r.cpf || r.telefone) : [],
        responsaveisBuscar: isMenor() ? quemBusca.filter(r => r.nome || r.cpf || r.telefone) : []
      };

      await ClienteService.atualizarCliente(usuario.id, payload);
      showSuccessModal("Seus dados foram salvos com sucesso.");
    } catch (error: any) {
      if (axios.isAxiosError(error)) showToast(error.response?.data?.message || "Erro ao salvar dados.", "danger");
    }
  };

  const alterarSenha = async () => {
    if (senhas.novaSenha !== senhas.confirmaSenha) return showToast("A nova senha e a confirmação não conferem.", "warning");
    try {
      await api.post("/auth/alterarsenha", { senhaAtual: senhas.senhaAtual, novaSenha: senhas.novaSenha });
      showSuccessModal("Sua senha foi alterada com sucesso.");
      setSenhas({ senhaAtual: "", novaSenha: "", confirmaSenha: "" });
      setShowSenhaModal(false);
    } catch (error: any) {
      if (axios.isAxiosError(error)) showToast(error.response?.data?.message || "Erro ao alterar senha.", "danger");
    }
  };

  const salvarEndereco = async () => {
    try {
      const payload = { cep: endereco.cep, logradouro: endereco.logradouro, numero: endereco.numero, complemento: endereco.complemento, bairro: endereco.bairro, cidade: endereco.cidade, uf: endereco.uf };
      if (endereco.id) await api.put(`/endereco/${endereco.id}`, payload);
      else {
        const response = await api.post("/endereco", payload);
        setEndereco((prev) => ({ ...prev, id: response.data.id }));
      }
      showSuccessModal("Endereço salvo com sucesso.");
      setOpenEndereco(false);
    } catch (error: any) {
      if (axios.isAxiosError(error)) showToast(error.response?.data?.message || "Erro ao salvar endereço.", "danger");
    }
  };

  const btnStyleAzul = { backgroundColor: senacAzul, borderColor: senacAzul, color: "#fff" };
  const btnStyleLaranja = { backgroundColor: senacLaranja, borderColor: senacLaranja, color: "#fff" };
  const textStyleAzul = { color: senacAzul };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">

      <style>
        {`
          .perfil-card-hover {
            transition: all 0.3s ease;
            border-radius: 16px !important;
          }
          .perfil-card-hover:hover {
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08) !important;
            transform: translateY(-3px);
          }
          .accordion-header-custom {
            transition: all 0.2s ease;
            border-radius: 12px !important;
          }
          .accordion-header-custom:hover {
            background-color: #f1f5f9 !important;
          }
        `}
      </style>

      {toast.show && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <div className={`toast align-items-center text-white bg-${toast.type} border-0 show shadow-lg`} role="alert">
            <div className="d-flex">
              <div className="toast-body fw-medium">{toast.message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ ...toast, show: false })}></button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DOCUMENTO RG */}
      <Modal
        show={showDocModal}
        onHide={() => { setShowDocModal(false); setSelectedFile(null); }}
        title="Gerenciar Documento (RG)"
        size="md"
        footer={
          <>
            <button type="button" className="btn btn-secondary fw-medium" onClick={() => { setShowDocModal(false); setSelectedFile(null); }} disabled={isUploadingDoc}>Cancelar</button>
            <button type="button" className="btn fw-medium text-white" style={{ backgroundColor: senacAzul }} onClick={salvarDocumentoModal} disabled={!selectedFile || isUploadingDoc}>
              {isUploadingDoc ? <><span className="spinner-border spinner-border-sm me-2"></span>Enviando...</> : <><i className="bi bi-cloud-arrow-up me-2"></i>Salvar Novo Documento</>}
            </button>
          </>
        }
      >
        <div className="text-center p-2">
          {usuario.urlDocumento ? (
            <div className="bg-light p-4 rounded-3 mb-4 border border-secondary border-opacity-25">
              <i className="bi bi-file-earmark-person fs-1" style={{ color: senacAzul }}></i>
              <p className="fw-bold mt-2 mb-3 text-dark">Você já possui um documento salvo no sistema.</p>
              <div className="d-flex justify-content-center gap-2">
                <a href={usuario.urlDocumento} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary fw-medium">
                  <i className="bi bi-eye me-1"></i> Visualizar
                </a>
                <button onClick={deletarDocumento} className="btn btn-sm btn-outline-danger fw-medium" disabled={isUploadingDoc}>
                  <i className="bi bi-trash3 me-1"></i> Excluir RG
                </button>
              </div>
            </div>
          ) : (
            <p className="text-muted small mb-4">Nenhum documento anexado. Para finalizar seu cadastro, envie uma imagem ou PDF legível do seu RG.</p>
          )}

          <div className="text-start">
            <label className="form-label fw-bold small text-muted">Selecionar arquivo (Substitui o atual)</label>
            <input type="file" className="form-control bg-light" accept="image/*,.pdf" onChange={handleFileChange} />
          </div>
        </div>
      </Modal>

      {/* MODAL: ALTERAR SENHA */}
      <Modal
        show={showSenhaModal}
        onHide={() => setShowSenhaModal(false)}
        title="Alterar Senha"
        size="md"
        footer={
          <>
            <button type="button" className="btn btn-secondary fw-medium" onClick={() => setShowSenhaModal(false)}>Cancelar</button>
            <button type="button" className="btn fw-medium text-white" style={{ backgroundColor: senacAzul }} onClick={alterarSenha}>
              <i className="bi bi-check2-circle me-1"></i> Confirmar Nova Senha
            </button>
          </>
        }
      >
        <div className="p-2">
          <div className="mb-3">
            <label className="form-label text-muted small fw-bold">Senha Atual</label>
            <input type="password" className="form-control bg-light" value={senhas.senhaAtual} onChange={(e) => setSenhas({ ...senhas, senhaAtual: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label text-muted small fw-bold">Nova Senha</label>
            <input type="password" className="form-control bg-light" value={senhas.novaSenha} onChange={(e) => setSenhas({ ...senhas, novaSenha: e.target.value })} />
          </div>
          <div>
            <label className="form-label text-muted small fw-bold">Confirme a Nova Senha</label>
            <input type="password" className="form-control bg-light" value={senhas.confirmaSenha} onChange={(e) => setSenhas({ ...senhas, confirmaSenha: e.target.value })} />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        show={modalConfig.show}
        onHide={() => setModalConfig({ ...modalConfig, show: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        variant={modalConfig.variant}
        isAlert={true}
      />

      <div className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-lg-9">

            {/* 1. CARD PRINCIPAL: MEUS DADOS */}
            <div className="card shadow-sm border-0 mb-4 perfil-card-hover" style={{ borderTop: `5px solid ${senacAzul}` }}>
              <div className="card-body p-4 p-md-5">
                <h4 className="fw-bold mb-4 d-flex align-items-center" style={textStyleAzul}>
                  <i className="bi bi-person-badge fs-3 me-2"></i> Meus Dados
                </h4>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Nome Completo</label>
                    <input type="text" className="form-control bg-light" value={usuario.nome} onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">E-mail</label>
                    <input type="email" className="form-control bg-light text-muted" value={usuario.email} disabled readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">CPF</label>
                    <input type="text" className="form-control bg-light text-muted" value={usuario.cpf} disabled readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Telefone</label>
                    <input type="text" className="form-control bg-light" value={usuario.telefone} onChange={(e) => setUsuario({ ...usuario, telefone: maskPhone(e.target.value) })} />
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3 align-items-center mt-2">
                  <button type="button" className="btn px-4 fw-medium shadow-sm" style={btnStyleAzul} onClick={salvarDadosCliente}>
                    <i className="bi bi-check2-circle me-1"></i> Salvar Dados
                  </button>

                  {isMenor() && (
                    <button
                      type="button"
                      className={`btn fw-medium ${usuario.urlDocumento ? 'btn-outline-success' : 'btn-outline-primary'}`}
                      onClick={() => setShowDocModal(true)}
                    >
                      <i className={`bi ${usuario.urlDocumento ? 'bi-file-earmark-check' : 'bi-file-earmark-plus'} me-1`}></i>
                      Gerenciar RG
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn fw-medium btn-outline-secondary"
                    onClick={() => setShowSenhaModal(true)}
                  >
                    <i className="bi bi-shield-lock me-1"></i> Alterar Senha
                  </button>
                </div>
              </div>
            </div>

            {/* 2. CARD ACORDEON: ENDEREÇOS */}
            <div className="card shadow-sm border-0 mb-4 perfil-card-hover">
              <div
                className={`card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center user-select-none accordion-header-custom ${openEndereco ? 'border-bottom' : ''}`}
                style={{ cursor: "pointer", borderBottomLeftRadius: openEndereco ? "0" : "12px", borderBottomRightRadius: openEndereco ? "0" : "12px" }}
                onClick={() => setOpenEndereco(!openEndereco)}
              >
                <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
                  <i className="bi bi-geo-alt fs-4 me-3" style={textStyleAzul}></i> Endereços
                </h5>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-light"
                  style={{ width: "36px", height: "36px", transform: openEndereco ? "rotate(180deg)" : "rotate(0deg)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
                >
                  <i className="bi bi-chevron-down text-secondary"></i>
                </div>
              </div>

              {openEndereco && (
                <div className="card-body p-4 pt-4 bg-white" style={{ borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-3">
                      <label className="form-label text-muted small fw-bold">CEP <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light" placeholder="00000-000" value={endereco.cep || ""} onChange={handleCepChange} />
                    </div>
                    <div className="col-md-7">
                      <label className="form-label text-muted small fw-bold">Logradouro <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light" value={endereco.logradouro || ""} onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label text-muted small fw-bold">Número <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light" value={endereco.numero || ""} onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-bold">Complemento</label>
                      <input type="text" className="form-control bg-light" placeholder="Apto, Bloco" value={endereco.complemento || ""} onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-bold">Bairro <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light" value={endereco.bairro || ""} onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label text-muted small fw-bold">Cidade <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light" value={endereco.cidade || ""} onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })} />
                    </div>
                    <div className="col-md-1">
                      <label className="form-label text-muted small fw-bold">UF <span className="text-danger">*</span></label>
                      <input type="text" className="form-control bg-light" value={endereco.uf || ""} onChange={(e) => setEndereco({ ...endereco, uf: e.target.value })} />
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn px-4 fw-medium shadow-sm" style={btnStyleAzul} onClick={salvarEndereco}>
                      <i className="bi bi-save me-1"></i> Salvar Endereço
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. CARD ACORDEON: RESPONSÁVEIS */}
            {isMenor() && (
              <div className="card shadow-sm border-0 mb-4 perfil-card-hover" style={{ borderLeft: `5px solid ${senacLaranja}` }}>
                <div
                  className={`card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center user-select-none accordion-header-custom ${openResponsaveis ? 'border-bottom' : ''}`}
                  style={{ cursor: "pointer", borderBottomLeftRadius: openResponsaveis ? "0" : "12px", borderBottomRightRadius: openResponsaveis ? "0" : "12px" }}
                  onClick={() => setOpenResponsaveis(!openResponsaveis)}
                >
                  <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
                    <i className="bi bi-people fs-4 me-3" style={{ color: senacLaranja }}></i> Responsáveis
                  </h5>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-light"
                    style={{ width: "36px", height: "36px", transform: openResponsaveis ? "rotate(180deg)" : "rotate(0deg)", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
                  >
                    <i className="bi bi-chevron-down text-secondary"></i>
                  </div>
                </div>

                {openResponsaveis && (
                  <div className="card-body p-4 pt-4 bg-white" style={{ borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
                    <h6 className="fw-bold mb-3" style={textStyleAzul}>Filiação (Responsáveis Legais)</h6>
                    <div className="row g-4 mb-5">
                      <div className="col-md-6 border-end-md">
                        <label className="form-label text-muted small fw-bold">Dados do Pai</label>
                        <input type="text" className="form-control bg-light mb-2" placeholder="Nome Completo" value={filiacao.pai.nome || ""} onChange={e => setFiliacao({ ...filiacao, pai: { ...filiacao.pai, nome: e.target.value } })} />
                        <input type="text" className="form-control bg-light mb-2" placeholder="CPF" value={filiacao.pai.cpf || ""} onChange={e => setFiliacao({ ...filiacao, pai: { ...filiacao.pai, cpf: maskCpf(e.target.value) } })} />
                        <input type="text" className="form-control bg-light" placeholder="Telefone" value={filiacao.pai.telefone || ""} onChange={e => setFiliacao({ ...filiacao, pai: { ...filiacao.pai, telefone: maskPhone(e.target.value) } })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">Dados da Mãe</label>
                        <input type="text" className="form-control bg-light mb-2" placeholder="Nome Completo" value={filiacao.mae.nome || ""} onChange={e => setFiliacao({ ...filiacao, mae: { ...filiacao.mae, nome: e.target.value } })} />
                        <input type="text" className="form-control bg-light mb-2" placeholder="CPF" value={filiacao.mae.cpf || ""} onChange={e => setFiliacao({ ...filiacao, mae: { ...filiacao.mae, cpf: maskCpf(e.target.value) } })} />
                        <input type="text" className="form-control bg-light" placeholder="Telefone" value={filiacao.mae.telefone || ""} onChange={e => setFiliacao({ ...filiacao, mae: { ...filiacao.mae, telefone: maskPhone(e.target.value) } })} />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                      <h6 className="fw-bold mb-0" style={textStyleAzul}>Autorizados a Buscar</h6>
                      {quemBusca.length < 3 && (
                        <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-medium" onClick={addResponsavelBuscar}>
                          + Adicionar Pessoa
                        </button>
                      )}
                    </div>

                    {quemBusca.map((resp, index) => (
                      <div key={index} className="row g-2 mb-3 align-items-center">
                        <div className="col-md-4"><input type="text" className="form-control bg-light" placeholder="Nome Completo" value={resp.nome || ""} onChange={e => updateResponsavelBuscar(index, 'nome', e.target.value)} /></div>
                        <div className="col-md-3"><input type="text" className="form-control bg-light" placeholder="CPF" value={resp.cpf || ""} onChange={e => updateResponsavelBuscar(index, 'cpf', e.target.value)} /></div>
                        <div className="col-md-4"><input type="text" className="form-control bg-light" placeholder="Telefone" value={resp.telefone || ""} onChange={e => updateResponsavelBuscar(index, 'telefone', e.target.value)} /></div>
                        <div className="col-md-1 text-end">
                          <button type="button" className="btn btn-outline-danger w-100" onClick={() => removerResponsavelBuscar(index)}>
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    {quemBusca.length === 0 && <p className="text-muted small fst-italic bg-light p-3 rounded-3 border text-center">Nenhuma pessoa autorizada adicionada.</p>}

                    <div className="text-end mt-4">
                      <button type="button" className="btn px-4 fw-medium shadow-sm" style={btnStyleLaranja} onClick={salvarDadosCliente}>
                        <i className="bi bi-save me-1"></i> Salvar Responsáveis
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PerfilPage;