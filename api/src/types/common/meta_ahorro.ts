export interface MetaAhorro {
    id: number;
    id_usuario: number;
    nombre: string;
    descripcion?: string;
    monto_objetivo: number;
    monto_acumulado: number;
    fecha_objetivo: string;
    estado: number;
    prioridad: number;
    promedio_ahorro_mensual?: number;
    fecha_inicio: string;
    fecha_completada?: string;
    creado_en: string;
    modificado_en?: string;
    creado_por?: number;
    modificado_por?: number;
}
