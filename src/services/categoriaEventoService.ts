import api from "./api";

export interface CategoriaEventoResponseDTO {
  id: number;
  nome: string;
}

export interface CategoriaEventoRequestDTO {
  nome: string;
}

export const CategoriaEventoService = {
  listarTodos: async (): Promise<CategoriaEventoResponseDTO[]> => {
    const response = await api.get<CategoriaEventoResponseDTO[]>("/categoriaEvento");
    return response.data;
  },

  buscarPorId: async (id: number): Promise<CategoriaEventoResponseDTO> => {
    const response = await api.get<CategoriaEventoResponseDTO>(`/categoriaEvento/${id}`);
    return response.data;
  },

  criarCategoria: async (data: CategoriaEventoRequestDTO): Promise<CategoriaEventoResponseDTO> => {
    const response = await api.post<CategoriaEventoResponseDTO>("/categoriaEvento", data);
    return response.data;
  },

  atualizarCategoria: async (id: number, data: CategoriaEventoRequestDTO): Promise<CategoriaEventoResponseDTO> => {
    const response = await api.put<CategoriaEventoResponseDTO>(`/categoriaEvento/${id}`, data);
    return response.data;
  },
};