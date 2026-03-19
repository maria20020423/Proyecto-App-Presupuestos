import {
  Transaccion,
  TransaccionesListResponse,
  CreateTransaccionDto,
  CreateTransaccionResult,
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

export const transaccionesService = {
  async getByPresupuesto(
    id_presupuesto: number,
    anio?: number,
    mes?: number,
    tipo?: string
  ): Promise<TransaccionesListResponse> {
    const params = new URLSearchParams({ id_presupuesto: id_presupuesto.toString() });
    if (anio) params.append("anio", anio.toString());
    if (mes) params.append("mes", mes.toString());
    if (tipo) params.append("tipo", tipo);
    return fetchApi<TransaccionesListResponse>(`/transacciones?${params.toString()}`);
  },

  async getById(id_transaccion: number): Promise<TransaccionesListResponse> {
    return fetchApi<TransaccionesListResponse>(`/transacciones/${id_transaccion}`);
  },

  async create(
    id_usuario: number,
    transaccion: CreateTransaccionDto
  ): Promise<CreateTransaccionResult> {
    return fetchApi<CreateTransaccionResult>("/transacciones", {
      method: "POST",
      body: JSON.stringify({ ...transaccion, creado_por: id_usuario }),
    });
  },

  async update(
    id_transaccion: number,
    id_usuario: number,
    transaccion: Partial<CreateTransaccionDto>
  ): Promise<ApiResponse> {
    return fetchApi<ApiResponse>(`/transacciones/${id_transaccion}`, {
      method: "PUT",
      body: JSON.stringify({ ...transaccion, modificado_por: id_usuario }),
    });
  },

  async delete(id_transaccion: number, id_usuario: number): Promise<ApiResponse> {
    return fetchApi<ApiResponse>(`/transacciones/${id_transaccion}`, {
      method: "DELETE",
      body: JSON.stringify({ modificado_por: id_usuario }),
    });
  },
};
