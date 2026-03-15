export interface Subcategoria {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion?: string;
  is_default: boolean;
  estado: string;
  creado_en: string;
  modificado_en?: string;
  creado_por?: number;
  modificado_por?: number;
}

export interface CreateSubcategoriaDto {
  nombre: string;
  descripcion?: string;
  is_default?: boolean;
}

export interface CreateSubcategoriaResponseDTO {
  message: string;
  id_subcategoria?: number;
}

export interface SubcategoriaListResponse {
  message: string;
  results?: Subcategoria[];
}
