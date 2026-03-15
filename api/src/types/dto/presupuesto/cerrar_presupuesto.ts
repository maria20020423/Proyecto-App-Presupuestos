// Request DTO for SP_CERRAR_PRESUPUESTO
export interface CerrarPresupuestoDto {
    modificado_por: number;
}

// Response DTO
export interface CerrarPresupuestoResult {
    total_ingresos: number;
    total_gastos: number;
    total_ahorros: number;
    balance_final: number;
}
