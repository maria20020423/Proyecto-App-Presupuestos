import {
  MetaAhorroListResponse,
  CreateMetaAhorroDto,
  UpdateMetaAhorroDto,
  CreateMetaAhorroResponse,
  ApiResponse,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error de red" }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}

export const metaAhorroService = {
  async getAll(): Promise<MetaAhorroListResponse> {
    return fetchApi<MetaAhorroListResponse>("/meta-ahorro");
  },

  async create(id_usuario: number, payload: CreateMetaAhorroDto): Promise<CreateMetaAhorroResponse> {
    return fetchApi<CreateMetaAhorroResponse>("/meta-ahorro", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        id_usuario,
        creado_por: id_usuario,
      }),
    });
  },

  async update(id_usuario: number, id_meta: number, payload: UpdateMetaAhorroDto): Promise<ApiResponse> {
    return fetchApi<ApiResponse>(`/meta-ahorro/${id_meta}`, {
      method: "PUT",
      body: JSON.stringify({
        ...payload,
        id_usuario,
        modificado_por: id_usuario,
      }),
    });
  },

  async delete(id_meta: number): Promise<ApiResponse> {
    return fetchApi<ApiResponse>(`/meta-ahorro/${id_meta}`, {
      method: "DELETE",
    });
  },
};
