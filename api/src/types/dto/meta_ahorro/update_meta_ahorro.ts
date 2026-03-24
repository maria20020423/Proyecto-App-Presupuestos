export interface UpdateMetaAhorroDto {
    id_usuario: number;
    nombre: string;
    descripcion?: string | null;
    monto_objetivo: number;
    monto_acumulado: number;
    fecha_objetivo: string;
    estado: string;
    prioridad: number;
    promedio_ahorro_mensual?: number | null;
    fecha_inicio: string;
    fecha_completada?: string | null;
    modificado_por: number;
}
