import {
  CreatePresupuestoDto,
  UpdatePresupuestoDto,
  PresupuestoListResponse,
  CreatePresupuestoResponseDTO,
  CrearPresupuestoCompletoDto,
  CrearPresupuestoCompletoResult,
  CerrarPresupuestoDto,
  CerrarPresupuestoResult,
  BalanceMensualResult,
  MontoEjecutadoMesResult,
  PorcentajeEjecucionMesResult,
  ResumenCategoriaMesResult,
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

export const presupuestoService = {
  async getAll(id_usuario: number, estado?: string): Promise<PresupuestoListResponse> {
    const params = new URLSearchParams({ id_usuario: id_usuario.toString() });
    if (estado) {
      params.append("estado", estado);
    }
    return fetchApi<PresupuestoListResponse>(`/presupuesto?${params.toString()}`);
  },

  async getById(id_presupuesto: number): Promise<PresupuestoListResponse> {
    return fetchApi<PresupuestoListResponse>(`/presupuesto/${id_presupuesto}`);
  },

  async create(id_usuario: number, presupuesto: CreatePresupuestoDto): Promise<CreatePresupuestoResponseDTO> {
    return fetchApi<CreatePresupuestoResponseDTO>("/presupuesto", {
      method: "POST",
      body: JSON.stringify({ ...presupuesto, id_usuario, creado_por: id_usuario }),
    });
  },

  async update(id_usuario: number, id_presupuesto: number, presupuesto: UpdatePresupuestoDto): Promise<ApiResponse> {
    return fetchApi<ApiResponse>(`/presupuesto/${id_presupuesto}`, {
      method: "PUT",
      body: JSON.stringify({ ...presupuesto, id_usuario, modificado_por: id_usuario }),
    });
  },

  async delete(id_presupuesto: number): Promise<ApiResponse> {
    return fetchApi<ApiResponse>(`/presupuesto/${id_presupuesto}`, {
      method: "DELETE",
    });
  },

  async crearCompleto(id_usuario: number, presupuesto: CrearPresupuestoCompletoDto): Promise<CrearPresupuestoCompletoResult> {
    return fetchApi<CrearPresupuestoCompletoResult>("/negocio/presupuesto/crear-completo", {
      method: "POST",
      body: JSON.stringify({ ...presupuesto, id_usuario, creado_por: id_usuario }),
    });
  },

  async cerrar(id_usuario: number, id_presupuesto: number, data: CerrarPresupuestoDto): Promise<CerrarPresupuestoResult> {
    return fetchApi<CerrarPresupuestoResult>(`/negocio/presupuesto/${id_presupuesto}/cerrar`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async getBalanceMensual(
    id_presupuesto: number,
    id_usuario: number,
    anio: number,
    mes: number
  ): Promise<BalanceMensualResult> {
    const params = new URLSearchParams({
      id_usuario: id_usuario.toString(),
      anio: anio.toString(),
      mes: mes.toString(),
    });
    return fetchApi<BalanceMensualResult>(`/negocio/presupuesto/${id_presupuesto}/balance-mensual?${params.toString()}`);
  },

  async getMontoEjecutado(
    id_presupuesto: number,
    id_subcategoria: number,
    anio: number,
    mes: number
  ): Promise<MontoEjecutadoMesResult> {
    const params = new URLSearchParams({
      id_subcategoria: id_subcategoria.toString(),
      anio: anio.toString(),
      mes: mes.toString(),
    });
    return fetchApi<MontoEjecutadoMesResult>(`/negocio/presupuesto/${id_presupuesto}/monto-ejecutado?${params.toString()}`);
  },

  async getPorcentajeEjecucion(
    id_presupuesto: number,
    id_subcategoria: number,
    anio: number,
    mes: number
  ): Promise<PorcentajeEjecucionMesResult> {
    const params = new URLSearchParams({
      id_subcategoria: id_subcategoria.toString(),
      anio: anio.toString(),
      mes: mes.toString(),
    });
    return fetchApi<PorcentajeEjecucionMesResult>(`/negocio/presupuesto/${id_presupuesto}/porcentaje-ejecucion?${params.toString()}`);
  },

  async getResumenCategoria(
    id_presupuesto: number,
    id_categoria: number,
    anio: number,
    mes: number
  ): Promise<ResumenCategoriaMesResult> {
    const params = new URLSearchParams({
      id_categoria: id_categoria.toString(),
      anio: anio.toString(),
      mes: mes.toString(),
    });
    return fetchApi<ResumenCategoriaMesResult>(`/negocio/presupuesto/${id_presupuesto}/resumen-categoria?${params.toString()}`);
  },
};
