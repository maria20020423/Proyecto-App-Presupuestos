export interface Transaccion {
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
  fecha: string;
  metodo_pago: string | null;
  no_factura: string | null;
  observaciones: string | null;
  estado: string;
  creado_en: string;
  modificado_en: string | null;
  creado_por: number | null;
  modificado_por: number | null;
}

export interface TransaccionesListResponse {
  message: string;
  results: Transaccion[];
}

export interface CreateTransaccionDto {
  id_usuario: number;
  presupuesto_id: number;
  anio: number;
  mes: number;
  subcategoria_id: number;
  obligacion_id?: number;
  tipo: string;
  descripcion: string;
  monto: number;
  fecha: string;
  metodo_pago?: string;
  no_factura?: string;
  observaciones?: string;
  creado_por: number;
}

export interface CreateTransaccionResult {
  message: string;
  id_transacciones: number;
}
