export interface CreateTransaccionDto {
    id_usuario: number;
    presupuesto_id: number;
    anio: number;
    mes: number;
    subcategoria_id: number;
    obligacion_id: number | null;
    tipo: string;
    descripcion: string | null;
    monto: number | null;
    fecha: string | null;
    metodo_pago: string | null;
    no_factura: string | null;
    observaciones: string | null;
    creado_por: number;
}
