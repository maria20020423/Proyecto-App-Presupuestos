// Response DTO for SP_PROCESAR_OBLIGACIONES_MES
export interface ObligacionMesResult {
    id_obligacion: number;
    nombre_obligacion: string;
    subcategoria_id: number;
    dia_vencimiento: number;
    dias_restantes: number;
    alerta: 'vencida' | 'vence_hoy' | 'por_vencer' | 'programada' | 'fuera_vigencia';
}
