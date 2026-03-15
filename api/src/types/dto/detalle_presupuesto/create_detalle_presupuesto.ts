export interface CreateDetallePresupuestoDto {
    presupuesto_id: number;
    subcategoria_id: number;
    monto_mensual: number;
    observaciones?: string;
    creado_por: number;
}
