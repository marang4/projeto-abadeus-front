import api from "./api";

export interface EventoRequestDTO {
  nome: string;
  descricao: string;
  quantidadeOcupacao: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  valor: number;
  categoriaId: number;
}

export interface EventoResponseDTO {
  id: number;
  nome: string;
  descricao: string;
  quantidadeOcupacao: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  valor: number;
  categoriaId: number;
  categoriaNome: string;
  urlImagemEvento?: string;
}

export interface CategoriaResponseDTO {
  id: number;
  nome: string;
}

export const EventoService = {
  listarTodos: async (): Promise<EventoResponseDTO[]> => {
    const response = await api.get<EventoResponseDTO[]>("/evento");
    return response.data;
  },

  buscarPorId: async (id: number): Promise<EventoResponseDTO> => {
    const response = await api.get<EventoResponseDTO>(`/evento/${id}`);
    return response.data;
  },

  criarEvento: async (data: EventoRequestDTO): Promise<EventoResponseDTO> => {
    const response = await api.post<EventoResponseDTO>("/evento", data);
    return response.data;
  },

  atualizarEvento: async (id: number, data: EventoRequestDTO): Promise<EventoResponseDTO> => {
    const response = await api.put<EventoResponseDTO>(`/evento/${id}`, data);
    return response.data;
  },

  atualizarImagem: async (id: number, arquivo: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", arquivo);
    await api.patch(`/evento/${id}/imagem`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deletarImagem: async (id: number): Promise<void> => {
    await api.delete(`/evento/${id}/imagem`);
  },

  listarCategorias: async (): Promise<CategoriaResponseDTO[]> => {
    const response = await api.get<CategoriaResponseDTO[]>("/categoriaEvento");
    return response.data;
  },
};