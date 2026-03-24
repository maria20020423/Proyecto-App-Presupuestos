import {
  ObligacionFijaListResponse,
  CreateObligacionFijaDto,
  UpdateObligacionFijaDto,
  CreateObligacionFijaResponse,
  ApiResponse,
} from "@/types/api";
import { authStorage } from "./apiClient";

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

export const obligacionFijaService = {
  async getAll(id_usuario: number, is_vigente?: boolean): Promise<ObligacionFijaListResponse> {
    const params = new URLSearchParams();
    params.append("id_usuario", id_usuario.toString());
    if (is_vigente !== undefined) {
      params.append("is_vigente", String(is_vigente));
    }
    return fetchApi<ObligacionFijaListResponse>(`/obligacion-fija?${params.toString()}`);
  },

  async create(id_usuario: number, payload: CreateObligacionFijaDto): Promise<CreateObligacionFijaResponse> {
    return fetchApi<CreateObligacionFijaResponse>("/obligacion-fija", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        id_usuario,
        creado_por: id_usuario,
      }),
    });
  },

  async update(
    id_usuario: number,
    id_obligacion: number,
    payload: UpdateObligacionFijaDto
  ): Promise<ApiResponse> {
    return fetchApi<ApiResponse>(`/obligacion-fija/${id_obligacion}`, {
      method: "PUT",
      body: JSON.stringify({
        ...payload,
        id_usuario,
        modificado_por: id_usuario,
      }),
    });
  },

  async delete(id_obligacion: number): Promise<ApiResponse> {
    const userId = authStorage.getUserId();
    return fetchApi<ApiResponse>(`/obligacion-fija/${id_obligacion}`, {
      method: "DELETE",
      body: JSON.stringify({ modificado_por: userId ?? undefined }),
    });
  },
};
