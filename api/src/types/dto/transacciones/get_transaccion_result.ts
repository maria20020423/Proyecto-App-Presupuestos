export interface GetTransaccionResult {
    id: number;
    id_usuario: number;
    presupuesto_id: number;
    anio: number;
    mes: number;
    subcategoria_id: number;
    obligacion_id: number | null;
    tipo: string;
    descripcion: string | null;
    monto: number | null;
    fecha: Date | null;
    metodo_pago: string | null;
    no_factura: string | null;
    observaciones: string | null;
    estado: string;
    creado_en: Date;
    modificado_en: Date | null;
    creado_por: number | null;
    modificado_por: number | null;
}
