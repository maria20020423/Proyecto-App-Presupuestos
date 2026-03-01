export interface Transacciones {
    id: number;
    id_usuario: number;
    presupuesto_id: number;
    anio: number;
    mes: number;
    subcategoria_id: number;
    obligacion_id?: number;
    descripcion?: string;
    monto?: number;
    fecha?: string;
    no_factura?: string;
    creado_en: string;
    modificado_en?: string;
    creado_por?: number;
    modificado_por?: number;
}
