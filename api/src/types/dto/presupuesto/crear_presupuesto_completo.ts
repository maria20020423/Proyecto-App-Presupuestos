// Request DTO for SP_CREAR_PRESUPUESTO_COMPLETO
export interface CrearPresupuestoCompletoDto {
    id_usuario: number;
    nombre: string;
    descripcion?: string;
    anio_inicio: number;
    mes_inicio: number;
    anio_fin: number;
    mes_fin: number;
    total_ingresos: number;
    total_gastos: number;
    total_ahorro: number;
    creado_por: number;
}

// Response DTO
export interface CrearPresupuestoCompletoResult {
    id_presupuesto: number;
}
