export interface DetallePresupuesto {
    id: number;
    presupuesto_id: number;
    subcategoria_id: number;
    observaciones?: string;
    monto_mensual?: number;
    modificado_en?: string;
    creado_en: string;
    creado_por?: number;
    modificado_por?: number;
}
