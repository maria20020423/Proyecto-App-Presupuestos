export type MetaAhorroEstado = "activo" | "completado" | "pausado" | "cancelado";

export interface MetaAhorro {
  id: number;
  id_usuario: number;
  nombre: string;
  descripcion: string | null;
  monto_objetivo: number;
  monto_acumulado: number;
  fecha_objetivo: string;
  estado: MetaAhorroEstado;
  prioridad: number;
  promedio_ahorro_mensual: number | null;
  fecha_inicio: string;
  fecha_completada: string | null;
  creado_en: string;
  modificado_en?: string | null;
  creado_por?: number | null;
  modificado_por?: number | null;
}

export interface MetaAhorroListResponse {
  message: string;
  results?: MetaAhorro[];
}

export interface CreateMetaAhorroDto {
  nombre: string;
  descripcion?: string | null;
  monto_objetivo: number;
  monto_acumulado?: number | null;
  fecha_objetivo: string;
  estado?: MetaAhorroEstado | null;
  prioridad?: number | null;
  promedio_ahorro_mensual?: number | null;
  fecha_inicio?: string | null;
  fecha_completada?: string | null;
}

export interface UpdateMetaAhorroDto extends CreateMetaAhorroDto {
  monto_acumulado: number;
  estado: MetaAhorroEstado;
  prioridad: number;
}

export interface CreateMetaAhorroResponse {
  message: string;
  id?: number;
}
