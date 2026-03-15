export interface GetDetallePresupuestoResult {
    id: number;
    presupuesto_id: number;
    subcategoria_id: number;
    monto_mensual: number;
    observaciones?: string;
    estado: 'activo' | 'inactivo';
    creado_en: string;
    modificado_en?: string;
    creado_por?: number;
    modificado_por?: number;
}
