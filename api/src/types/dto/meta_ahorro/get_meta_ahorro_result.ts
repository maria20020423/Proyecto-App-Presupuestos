export interface GetMetaAhorroResult {
    id: number;
    id_usuario: number;
    nombre: string;
    descripcion: string | null;
    monto_objetivo: number;
    monto_acumulado: number;
    fecha_objetivo: Date;
    estado: string;
    prioridad: number;
    promedio_ahorro_mensual: number | null;
    fecha_inicio: Date;
    fecha_completada: Date | null;
    creado_en: Date;
    modificado_en: Date | null;
    creado_por: number | null;
    modificado_por: number | null;
}
