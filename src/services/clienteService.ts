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

  atualizarCliente: async (id: number, data: ClienteUpdateDTO): Promise<ClienteResponseDTO> => {
    const response = await api.put<ClienteResponseDTO>(`/clientes/${id}`, data);
    return response.data;
  },

  atualizarDocumento: async (id: number, arquivo: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", arquivo);

    await api.patch(`/clientes/${id}/documento`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deletarCliente: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },
};