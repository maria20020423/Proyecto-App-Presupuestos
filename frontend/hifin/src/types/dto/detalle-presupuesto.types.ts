import { ApiResponse } from "@/types/common/common.types";

export type DetallePresupuestoEstado = "activo" | "inactivo";

export interface DetallePresupuesto {
  id: number;
  presupuesto_id: number;
  subcategoria_id: number;
  monto_mensual: number;
  observaciones?: string;
  estado: DetallePresupuestoEstado;
  creado_en: string;
  modificado_en?: string;
  creado_por?: number;
  modificado_por?: number;
}

export interface CreateDetallePresupuestoDto {
  presupuesto_id: number;
  subcategoria_id: number;
  monto_mensual: number;
  observaciones?: string;
  creado_por: number;
}

export interface UpdateDetallePresupuestoDto {
  monto_mensual: number;
  observaciones?: string;
  modificado_por: number;
}

export interface DetallePresupuestoListResponse extends ApiResponse {
  results?: DetallePresupuesto[];
}

export interface DetallePresupuestoResponse extends ApiResponse {
  results?: DetallePresupuesto;
}

export interface CreateDetallePresupuestoResponseDTO extends ApiResponse {
  id_detalle?: number;
}
