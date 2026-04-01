import React, { useState, useEffect } from "react";

export default function PerfilPage() {
  // 1. Estado inicial vazio, aguardando os dados do backend
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    tipo: "cliente",
  });

  const [endereco, setEndereco] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
  });

  // 2. Busca os dados reais do usuário logado assim que a tela carrega
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        // Pega o token de onde você estiver salvando (localStorage, sessionStorage, etc)
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Passando o token para evitar o erro 401
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const dadosBackend = await response.json();
          setUsuario({
            nome: dadosBackend.nome || "",
            email: dadosBackend.email || "",
            tipo: dadosBackend.tipo || "cliente", // Ajuste conforme o campo que define o tipo no seu banco
          });
        } else {
          console.error("Usuário não autorizado ou erro na requisição");
        }
      } catch (error) {
        console.error("Erro ao conectar com a API:", error);
      }
    };

    carregarDadosUsuario();
  }, []); // O array vazio garante que isso rode apenas uma vez ao abrir a tela

  // 3. Integração com a API do ViaCEP
  const buscarCep = async (cepBusca: string) => {
    const cepLimpo = cepBusca.replace(/\D/g, "");

    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`,
        );
        const data = await response.json();

        if (!data.erro) {
          setEndereco((prev) => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          }));
        }
      } catch (error) {
        console.error("Erro ao consultar o ViaCEP:", error);
      }
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoCep = e.target.value;
    setEndereco({ ...endereco, cep: novoCep });

    if (novoCep.replace(/\D/g, "").length === 8) {
      buscarCep(novoCep);
    }
  };

  return (
    <div className="container-fluid bg-light py-4">
      <div className="row mb-4">
        {/* --- CARD: MEUS DADOS --- */}
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4">Meus Dados</h5>
              <form>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label text-muted">
                    Nome <span className="text-danger">*</span>
                  </label>
                  {/* Agora o defaultValue puxa do estado que veio do backend */}
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    defaultValue={usuario.nome}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label text-muted">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    defaultValue={usuario.email}
                  />
                </div>
                {/* Corrigida a cor do botão para btn-primary */}
                <button type="button" className="btn btn-primary px-4">
                  SALVAR
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- CARD: ALTERAR SENHA --- */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4">Alterar a Senha</h5>
              <form>
                <div className="mb-3">
                  <label htmlFor="senhaAtual" className="form-label text-muted">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="senhaAtual"
                  />
                </div>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label
                      htmlFor="novaSenha"
                      className="form-label text-muted"
                    >
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="novaSenha"
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="confirmaSenha"
                      className="form-label text-muted"
                    >
                      Confirme a Nova Senha
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmaSenha"
                    />
                  </div>
                </div>
                <button type="button" className="btn btn-primary px-4">
                  ALTERAR
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* --- CARD: ENDEREÇO --- */}
      {usuario.tipo === "cliente" && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4">
                  Endereço de Entrega/Faturamento
                </h5>
                <form>
                  <div className="row mb-3">
                    <div className="col-md-3 mb-3 mb-md-0">
                      <label htmlFor="cep" className="form-label text-muted">
                        CEP <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cep"
                        placeholder="00000-000"
                        value={endereco.cep}
                        onChange={handleCepChange}
                      />
                    </div>
                    <div className="col-md-7 mb-3 mb-md-0">
                      <label
                        htmlFor="logradouro"
                        className="form-label text-muted"
                      >
                        Logradouro
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        id="logradouro"
                        value={endereco.logradouro}
                        readOnly
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor="numero" className="form-label text-muted">
                        Número <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="numero"
                        value={endereco.numero}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEndereco({ ...endereco, numero: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <label
                        htmlFor="complemento"
                        className="form-label text-muted"
                      >
                        Complemento
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="complemento"
                        placeholder="Apto, Bloco, etc."
                        value={endereco.complemento}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEndereco({
                            ...endereco,
                            complemento: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                      <label htmlFor="bairro" className="form-label text-muted">
                        Bairro
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        id="bairro"
                        value={endereco.bairro}
                        readOnly
                      />
                    </div>
                    <div className="col-md-3 mb-3 mb-md-0">
                      <label htmlFor="cidade" className="form-label text-muted">
                        Cidade
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        id="cidade"
                        value={endereco.cidade}
                        readOnly
                      />
                    </div>
                    <div className="col-md-1">
                      <label htmlFor="uf" className="form-label text-muted">
                        UF
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light"
                        id="uf"
                        value={endereco.uf}
                        readOnly
                      />
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary px-4">
                    SALVAR ENDEREÇO
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
