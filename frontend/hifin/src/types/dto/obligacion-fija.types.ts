export interface ObligacionFija {
  id: number;
  id_usuario: number;
  subcategoria_id: number;
  nombre: string;
  descripcion: string;
  dia_mes_expiracion: number;
  monto: number;
  is_vigente: boolean;
  fecha_inicio: string;
  fecha_final: string | null;
  creado_en: string;
  modificado_en?: string | null;
  creado_por: number;
  modificado_por?: number | null;
}

export interface CreateObligacionFijaDto {
  subcategoria_id: number;
  nombre: string;
  descripcion: string;
  dia_mes_expiracion: number;
  monto: number;
  is_vigente: boolean;
  fecha_inicio?: string | null;
  fecha_final?: string | null;
}

export interface UpdateObligacionFijaDto {
  subcategoria_id: number;
  nombre: string;
  descripcion: string;
  dia_mes_expiracion: number;
  monto: number;
  is_vigente: boolean;
  fecha_inicio?: string | null;
  fecha_final?: string | null;
}

export interface ObligacionFijaListResponse {
  message: string;
  results?: ObligacionFija[];
}

export interface CreateObligacionFijaResponse {
  message: string;
  id?: number;
}

export interface SubcategoriaOption extends Subcategoria {}
