import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../services/api";

export default function PerfilPage() {
  const [usuario, setUsuario] = useState({ id: null, nome: "", email: "", cpf: "", telefone: "", dataNascimento: "" });
  const [endereco, setEndereco] = useState({ id: null, cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", uf: "" });
  const [senhas, setSenhas] = useState({ senhaAtual: "", novaSenha: "", confirmaSenha: "" });
  
  const [filiacao, setFiliacao] = useState({
    pai: { id: null, nome: "", cpf: "", telefone: "" },
    mae: { id: null, nome: "", cpf: "", telefone: "" }
  });
  const [quemBusca, setQuemBusca] = useState<any[]>([]);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const senacAzul = "#1453bd";
  const senacLaranja = "#f19000";

  const showToast = (message: string, type: "success" | "danger" | "warning" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 5000);
  };

  // --- FUNÇÕES DE MÁSCARA ---
  const maskCpf = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const maskPhone = (value: string) => {
    let v = value.replace(/\D/g, "");
    if (v.length <= 10) {
      return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
    }
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/(-\d{4})\d+?$/, "$1");
  };

  // Nova máscara exclusiva para o CEP
  const maskCep = (value: string) => {
    const v = value.replace(/\D/g, "");
    return v.length > 5 ? v.replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9) : v;
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resAuth = await api.get("/auth/me");
        const userAuth = resAuth.data;
        if (!userAuth || !userAuth.id) return;

        const resCliente = await api.get(`/clientes/${userAuth.id}`);
        const d = resCliente.data;

        setUsuario({
          id: d.id,
          nome: d.nome || d.usuario?.nome || userAuth.nome || "",
          email: d.email || d.usuario?.email || userAuth.email || "",
          cpf: maskCpf(d.cpf || ""),
          telefone: maskPhone(d.telefone || ""),
          dataNascimento: d.dataNascimento || ""
        });
        
        if (d.responsaveis && d.responsaveis.length >= 2) {
          setFiliacao({ 
            pai: { ...d.responsaveis[0], cpf: maskCpf(d.responsaveis[0].cpf), telefone: maskPhone(d.responsaveis[0].telefone) }, 
            mae: { ...d.responsaveis[1], cpf: maskCpf(d.responsaveis[1].cpf), telefone: maskPhone(d.responsaveis[1].telefone) } 
          });
        } else if (d.responsaveis && d.responsaveis.length === 1) {
          setFiliacao({ 
            pai: { ...d.responsaveis[0], cpf: maskCpf(d.responsaveis[0].cpf), telefone: maskPhone(d.responsaveis[0].telefone) }, 
            mae: { id: null, nome: "", cpf: "", telefone: "" } 
          });
        }

        if (d.responsaveisBuscar) {
          const formatados = d.responsaveisBuscar.map((r: any) => ({
            ...r, cpf: maskCpf(r.cpf), telefone: maskPhone(r.telefone)
          }));
          setQuemBusca(formatados);
        }

        // CORREÇÃO: Mapeando e carregando o endereço salvo no banco corretamente
        if (d.endereco) {
          setEndereco({
            id: d.endereco.id,
            cep: maskCep(d.endereco.cep || ""),
            logradouro: d.endereco.logradouro || "",
            numero: d.endereco.numero || "",
            complemento: d.endereco.complemento || "",
            bairro: d.endereco.bairro || "",
            cidade: d.endereco.cidade || "",
            uf: d.endereco.uf || "",
          });
        }
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      }
    };
    carregarDados();
  }, []);

  const isMenor = () => {
    if (!usuario.dataNascimento) return false;
    const dataNascimento = new Date(usuario.dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const m = hoje.getMonth() - dataNascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }
    return idade < 18;
  };

  const addResponsavelBuscar = () => {
    if (quemBusca.length < 3) {
      setQuemBusca([...quemBusca, { nome: "", cpf: "", telefone: "" }]);
    }
  };

  const updateResponsavelBuscar = (index: number, field: string, value: string) => {
    const novaLista = [...quemBusca];
    if (field === 'cpf') value = maskCpf(value);
    if (field === 'telefone') value = maskPhone(value);
    novaLista[index][field] = value;
    setQuemBusca(novaLista);
  };

  const removerResponsavelBuscar = (index: number) => {
    setQuemBusca(quemBusca.filter((_, i) => i !== index));
  };

  // CORREÇÃO: ViaCEP usando o fetch nativo para evitar bloqueios do Axios
  const buscarCep = async (cepBusca: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepBusca}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setEndereco((prev) => ({
          ...prev,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          uf: data.uf || "",
        }));
        
        // Alerta amigável se for um CEP genérico que não preenche a rua
        if (!data.logradouro) {
          showToast("CEP localizado, mas você precisa preencher o logradouro e bairro manualmente.", "warning");
        }
      } else {
        showToast("CEP não encontrado.", "warning");
      }
    } catch (error) {
      showToast("Erro ao consultar o ViaCEP.", "danger");
    }
  };

  // CORREÇÃO: Integrando a máscara diretamente na digitação
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setEndereco({ ...endereco, cep: maskCep(e.target.value) });
    
    if (rawValue.length === 8) {
      buscarCep(rawValue);
    }
  };

  const salvarDadosCliente = async () => {
    if (!usuario.id) return;
    try {
      const respsValidos = [filiacao.pai, filiacao.mae].filter(r => r.nome || r.cpf || r.telefone);
      const buscasValidos = quemBusca.filter(r => r.nome || r.cpf || r.telefone);

      const payload = {
        nome: usuario.nome,
        telefone: usuario.telefone,
        responsaveis: isMenor() ? respsValidos : [],
        responsaveisBuscar: isMenor() ? buscasValidos : []
      };
      
      await api.put(`/clientes/${usuario.id}`, payload);
      showToast("Dados salvos com sucesso!", "success");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        showToast(error.response?.data?.message || "Erro ao salvar dados. Verifique os campos.", "danger");
      }
    }
  };

  const alterarSenha = async () => {
    if (senhas.novaSenha !== senhas.confirmaSenha) {
      showToast("A nova senha e a confirmação não conferem.", "warning");
      return;
    }
    try {
      await api.post("/auth/alterarsenha", {
        senhaAtual: senhas.senhaAtual,
        novaSenha: senhas.novaSenha
      });
      showToast("Senha alterada com sucesso!", "success");
      setSenhas({ senhaAtual: "", novaSenha: "", confirmaSenha: "" });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        showToast(error.response?.data?.message || "Erro ao alterar senha.", "danger");
      }
    }
  };

  const salvarEndereco = async () => {
    try {
      const payload = {
        cep: endereco.cep, logradouro: endereco.logradouro, numero: endereco.numero,
        complemento: endereco.complemento, bairro: endereco.bairro, cidade: endereco.cidade, uf: endereco.uf
      };

      if (endereco.id) {
        await api.put(`/endereco/${endereco.id}`, payload);
      } else {
        const response = await api.post("/endereco", payload);
        setEndereco((prev) => ({ ...prev, id: response.data.id }));
      }
      showToast("Endereço salvo com sucesso!", "success");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        showToast(error.response?.data?.message || "Erro ao salvar endereço. Preencha todos os campos obrigatórios.", "danger");
      }
    }
  };

  const btnStyleAzul = { backgroundColor: senacAzul, borderColor: senacAzul, color: "#fff" };
  const btnStyleLaranja = { backgroundColor: senacLaranja, borderColor: senacLaranja, color: "#fff" };
  const textStyleAzul = { color: senacAzul };
  const textStyleLaranja = { color: senacLaranja };

  return (
    <div className="container-fluid bg-light py-4 position-relative">
      
      {toast.show && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1055 }}>
          <div className={`toast align-items-center text-white bg-${toast.type} border-0 show`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body fw-medium">
                {toast.message}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ ...toast, show: false })}></button>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4" style={textStyleAzul}>Meus Dados</h5>
              <form>
                <div className="row mb-3">
                  <div className="col-md-7">
                    <label htmlFor="nome" className="form-label text-muted">Nome <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="nome" value={usuario.nome}
                      onChange={(e) => setUsuario({ ...usuario, nome: e.target.value })} />
                  </div>
                  <div className="col-md-5">
                    <label htmlFor="telefoneUser" className="form-label text-muted">Telefone <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="telefoneUser" value={usuario.telefone}
                      onChange={(e) => setUsuario({ ...usuario, telefone: maskPhone(e.target.value) })} />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="cpf" className="form-label text-muted">CPF</label>
                    <input type="text" className="form-control bg-light text-muted opacity-50 user-select-none" id="cpf" value={usuario.cpf} disabled readOnly />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label text-muted">Email</label>
                    <input type="email" className="form-control bg-light text-muted opacity-50 user-select-none" id="email" value={usuario.email} disabled readOnly />
                  </div>
                </div>

                <button type="button" className="btn px-4" style={btnStyleAzul} onClick={salvarDadosCliente}>
                  SALVAR DADOS
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4" style={textStyleAzul}>Alterar a Senha</h5>
              <form>
                <div className="mb-3">
                  <label htmlFor="senhaAtual" className="form-label text-muted">Senha Atual</label>
                  <input type="password" className="form-control" id="senhaAtual" value={senhas.senhaAtual}
                    onChange={(e) => setSenhas({ ...senhas, senhaAtual: e.target.value })} />
                </div>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="novaSenha" className="form-label text-muted">Nova Senha</label>
                    <input type="password" className="form-control" id="novaSenha" value={senhas.novaSenha}
                      onChange={(e) => setSenhas({ ...senhas, novaSenha: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="confirmaSenha" className="form-label text-muted">Confirme a Nova Senha</label>
                    <input type="password" className="form-control" id="confirmaSenha" value={senhas.confirmaSenha}
                      onChange={(e) => setSenhas({ ...senhas, confirmaSenha: e.target.value })} />
                  </div>
                </div>
                <button type="button" className="btn px-4" style={btnStyleAzul} onClick={alterarSenha}>
                  ALTERAR SENHA
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {isMenor() && (
        <>
          <div className="card shadow-sm border-0 mb-4" style={{ borderLeft: `4px solid ${senacLaranja}` }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={textStyleLaranja}>Filiação (Responsáveis Legais)</h5>
                <button type="button" className="btn px-4 btn-sm" style={btnStyleAzul} onClick={salvarDadosCliente}>
                  SALVAR RESPONSÁVEIS
                </button>
              </div>
              <div className="row">
                <div className="col-md-6 border-end">
                  <p className="fw-bold" style={textStyleAzul}>Dados do Pai</p>
                  <input type="text" className="form-control mb-2" placeholder="Nome Completo" value={filiacao.pai.nome || ""} 
                    onChange={e => setFiliacao({...filiacao, pai: {...filiacao.pai, nome: e.target.value}})} />
                  <input type="text" className="form-control mb-2" placeholder="CPF" value={filiacao.pai.cpf || ""}
                    onChange={e => setFiliacao({...filiacao, pai: {...filiacao.pai, cpf: maskCpf(e.target.value)}})} />
                  <input type="text" className="form-control" placeholder="Telefone" value={filiacao.pai.telefone || ""}
                    onChange={e => setFiliacao({...filiacao, pai: {...filiacao.pai, telefone: maskPhone(e.target.value)}})} />
                </div>
                <div className="col-md-6">
                  <p className="fw-bold" style={textStyleAzul}>Dados da Mãe</p>
                  <input type="text" className="form-control mb-2" placeholder="Nome Completo" value={filiacao.mae.nome || ""}
                    onChange={e => setFiliacao({...filiacao, mae: {...filiacao.mae, nome: e.target.value}})} />
                  <input type="text" className="form-control mb-2" placeholder="CPF" value={filiacao.mae.cpf || ""}
                    onChange={e => setFiliacao({...filiacao, mae: {...filiacao.mae, cpf: maskCpf(e.target.value)}})} />
                  <input type="text" className="form-control" placeholder="Telefone" value={filiacao.mae.telefone || ""}
                    onChange={e => setFiliacao({...filiacao, mae: {...filiacao.mae, telefone: maskPhone(e.target.value)}})} />
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4" style={{ borderLeft: `4px solid ${senacAzul}` }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={textStyleAzul}>Responsáveis por Buscar (Evento Senac)</h5>
                <div>
                  {quemBusca.length < 3 && (
                    <button type="button" className="btn btn-sm me-2" style={{ borderColor: senacAzul, color: senacAzul }} onClick={addResponsavelBuscar}>
                      + Adicionar 
                    </button>
                  )}
                  <button type="button" className="btn btn-sm px-4" style={btnStyleLaranja} onClick={salvarDadosCliente}>
                    SALVAR LISTA DE BUSCA
                  </button>
                </div>
              </div>
              
              {quemBusca.map((resp, index) => (
                <div key={index} className="row g-2 mb-3 pb-3 border-bottom align-items-center">
                  <div className="col-md-4">
                    <input type="text" className="form-control" placeholder="Nome Completo" value={resp.nome || ""} 
                      onChange={e => updateResponsavelBuscar(index, 'nome', e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <input type="text" className="form-control" placeholder="CPF" value={resp.cpf || ""}
                      onChange={e => updateResponsavelBuscar(index, 'cpf', e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <input type="text" className="form-control" placeholder="Telefone" value={resp.telefone || ""}
                      onChange={e => updateResponsavelBuscar(index, 'telefone', e.target.value)} />
                  </div>
                  <div className="col-md-1 text-end">
                    <button type="button" className="btn btn-outline-danger w-100" onClick={() => removerResponsavelBuscar(index)}>
                      &times;
                    </button>
                  </div>
                </div>
              ))}
              {quemBusca.length === 0 && <p className="text-muted fst-italic">Nenhum responsável de busca adicionado.</p>}
            </div>
          </div>
        </>
      )}

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4" style={textStyleAzul}>Endereço de Entrega/Faturamento</h5>
              <form>
                <div className="row mb-3">
                  <div className="col-md-3 mb-3 mb-md-0">
                    <label htmlFor="cep" className="form-label text-muted">CEP <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="cep" placeholder="00000-000" value={endereco.cep || ""} onChange={handleCepChange} />
                  </div>
                  <div className="col-md-7 mb-3 mb-md-0">
                    <label htmlFor="logradouro" className="form-label text-muted">Logradouro <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="logradouro" value={endereco.logradouro || ""} onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <label htmlFor="numero" className="form-label text-muted">Número <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="numero" value={endereco.numero || ""} onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })} />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <label htmlFor="complemento" className="form-label text-muted">Complemento</label>
                    <input type="text" className="form-control" id="complemento" placeholder="Apto, Bloco, etc." value={endereco.complemento || ""} onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })} />
                  </div>
                  <div className="col-md-4 mb-3 mb-md-0">
                    <label htmlFor="bairro" className="form-label text-muted">Bairro <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="bairro" value={endereco.bairro || ""} onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })} />
                  </div>
                  <div className="col-md-3 mb-3 mb-md-0">
                    <label htmlFor="cidade" className="form-label text-muted">Cidade <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="cidade" value={endereco.cidade || ""} onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })} />
                  </div>
                  <div className="col-md-1">
                    <label htmlFor="uf" className="form-label text-muted">UF <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="uf" value={endereco.uf || ""} onChange={(e) => setEndereco({ ...endereco, uf: e.target.value })} />
                  </div>
                </div>
                <button type="button" className="btn px-4" style={btnStyleAzul} onClick={salvarEndereco}>
                  SALVAR ENDEREÇO
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}