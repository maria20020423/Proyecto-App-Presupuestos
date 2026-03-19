import {
  DetallePresupuestoListResponse,
  DetallePresupuestoResponse,
  CreateDetallePresupuestoDto,
  UpdateDetallePresupuestoDto,
  CreateDetallePresupuestoResponseDTO,
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

export const detallePresupuestoService = {
  async listByPresupuesto(id_presupuesto: number): Promise<DetallePresupuestoListResponse> {
    return fetchApi<DetallePresupuestoListResponse>(`/detalle-presupuesto/presupuesto/${id_presupuesto}`);
  },

  async getById(id_detalle: number): Promise<DetallePresupuestoResponse> {
    return fetchApi<DetallePresupuestoResponse>(`/detalle-presupuesto/${id_detalle}`);
  },

  async create(data: CreateDetallePresupuestoDto): Promise<CreateDetallePresupuestoResponseDTO> {
    return fetchApi<CreateDetallePresupuestoResponseDTO>("/detalle-presupuesto", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id_detalle: number, data: UpdateDetallePresupuestoDto): Promise<ApiResponse> {
    return fetchApi<ApiResponse>(`/detalle-presupuesto/${id_detalle}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id_detalle: number, modificado_por: number): Promise<ApiResponse> {
    const params = new URLSearchParams({ modificado_por: modificado_por.toString() });
    return fetchApi<ApiResponse>(`/detalle-presupuesto/${id_detalle}?${params.toString()}`, {
      method: "DELETE",
    });
  },
};
