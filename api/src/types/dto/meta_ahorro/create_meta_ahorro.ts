export interface CreateMetaAhorroDto {
    id_usuario: number;
    nombre: string;
    descripcion?: string | null;
    monto_objetivo: number;
    monto_acumulado?: number | null;
    fecha_objetivo: string;
    estado?: string | null;
    prioridad?: number | null;
    promedio_ahorro_mensual?: number | null;
    fecha_inicio?: string | null;
    fecha_completada?: string | null;
    creado_por?: number | null;
}
