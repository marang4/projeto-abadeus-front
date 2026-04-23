import api from "./api";

export interface EnderecoRequestDTO {
  cep: string;
  logradouro?: string;
  numero: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
}

export interface EnderecoResponseDTO extends EnderecoRequestDTO {
  id: number;
}

export interface ResponsavelRequestDTO {
  id?: number;
  nome: string;
  cpf: string;
  telefone: string;
}

export interface ResponsavelBuscarRequestDTO {
  id?: number;
  nome: string;
  cpf: string;
  telefone: string;
}

export interface ResponsavelResponseDTO {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
}

export interface ResponsavelBuscarResponseDTO {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
}

export interface ClienteRequestDTO {
  nome: string;
  telefone: string;
  email: string;
  senha?: string;
  cpf: string;
  dataNascimento: string;
  endereco?: EnderecoRequestDTO;
}

export interface ClienteUpdateDTO {
  nome: string;
  telefone: string;
  senha?: string;
  urlDocumento?: string;
  endereco?: EnderecoRequestDTO;
  responsaveis?: ResponsavelRequestDTO[];
  responsaveisBuscar?: ResponsavelBuscarRequestDTO[];
}

export interface ClienteResponseDTO {
  id: number;
  nome: string;
  email: string;
  role: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  tipoCliente: "NORMAL" | "ALUNO";
  urlDocumento?: string;
  endereco?: EnderecoResponseDTO;
  responsaveis?: ResponsavelResponseDTO[];
  responsaveisBuscar?: ResponsavelBuscarResponseDTO[];
}

export const ClienteService = {
  criarCliente: async (data: ClienteRequestDTO): Promise<ClienteResponseDTO> => {
    const response = await api.post<ClienteResponseDTO>("/clientes", data);
    return response.data;
  },

  buscarPorId: async (id: number): Promise<ClienteResponseDTO> => {
    const response = await api.get<ClienteResponseDTO>(`/clientes/${id}`);
    return response.data;
  },

  listarTodos: async (): Promise<ClienteResponseDTO[]> => {
    const response = await api.get<ClienteResponseDTO[]>("/clientes");
    return response.data;
  },

  // Ajustado para receber o arquivo e enviar como multipart/form-data
  atualizarCliente: async (id: number, data: ClienteUpdateDTO, arquivo?: File | null): Promise<ClienteResponseDTO> => {
    const formData = new FormData();
    
    // O backend espera o DTO como um Blob tipado como JSON
    formData.append("clienteUpdate", new Blob([JSON.stringify(data)], { type: "application/json" }));
    
    // Se o usuário selecionou um arquivo, anexa no form
    if (arquivo) {
      formData.append("arquivo", arquivo);
    }

    const response = await api.put<ClienteResponseDTO>(`/clientes/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deletarCliente: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },
};