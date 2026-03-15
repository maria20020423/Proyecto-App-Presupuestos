export type PresupuestoEstado = "activo" | "cerrado" | "borrador";

export interface GetPresupuestoResult {
  id_presupuesto: number;
  id_usuario: number;
  nombre_presupuesto: string;
  anio_inicio: number;
  mes_inicio: number;
  anio_fin: number;
  mes_fin: number;
  total_ingresos_planificados: number;
  total_gastos_planificados: number;
  total_ahorro_planificado: number;
  fecha_creacion: string;
  estado: PresupuestoEstado;
  creado_en: string;
  modificado_en?: string;
  creado_por?: number;
  modificado_por?: number;
}

export interface CreatePresupuestoDto {
  nombre_presupuesto: string;
  anio_inicio: number;
  mes_inicio: number;
  anio_fin: number;
  mes_fin: number;
  total_ingresos_planificados: number;
  total_gastos_planificados: number;
  total_ahorro_planificado: number;
  fecha_creacion: string;
  estado: PresupuestoEstado;
  creado_en: string;
}

export interface UpdatePresupuestoDto {
  nombre_presupuesto: string;
  anio_inicio: number;
  mes_inicio: number;
  anio_fin: number;
  mes_fin: number;
  total_ingresos_planificados: number;
  total_gastos_planificados: number;
  total_ahorro_planificado: number;
  estado: PresupuestoEstado;
}

export interface PresupuestoListResponse {
  message: string;
  results?: GetPresupuestoResult[];
}

export interface CreatePresupuestoResponseDTO {
  message: string;
  id_presupuesto?: number;
}

export interface CrearPresupuestoCompletoDto {
  nombre: string;
  descripcion?: string;
  anio_inicio: number;
  mes_inicio: number;
  anio_fin: number;
  mes_fin: number;
  total_ingresos: number;
  total_gastos: number;
  total_ahorro: number;
}

export interface CrearPresupuestoCompletoResult {
  id_presupuesto: number;
}

export interface CerrarPresupuestoDto {
  modificado_por: number;
}

export interface CerrarPresupuestoResult {
  total_ingresos: number;
  total_gastos: number;
  total_ahorros: number;
  balance_final: number;
}

export interface BalanceMensualResult {
  total_ingresos: number;
  total_gastos: number;
  total_ahorros: number;
  balance_final: number;
}

export interface MontoEjecutadoMesResult {
  monto_ejecutado: number;
}

export interface PorcentajeEjecucionMesResult {
  porcentaje: number;
}

export interface ResumenCategoriaMesResult {
  monto_presupuestado: number;
  monto_ejecutado: number;
  porcentaje: number;
}
