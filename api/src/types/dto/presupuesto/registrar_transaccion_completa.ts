// Request DTO for SP_REGISTRAR_TRANSACCION_COMPLETA
export interface RegistrarTransaccionCompletaDto {
    id_usuario: number;
    id_presupuesto: number;
    anio: number;
    mes: number;
    id_subcategoria: number;
    id_obligacion?: number | null;
    tipo: 'ingreso' | 'gasto' | 'ahorro';
    descripcion?: string;
    monto: number;
    fecha: string; // ISO date string YYYY-MM-DD
    metodo_pago?: string;
    no_factura?: string;
    observaciones?: string;
    creado_por: number;
}

// Response DTO
export interface RegistrarTransaccionCompletaResult {
    id_transaccion: number;
    mensaje: string;
}
