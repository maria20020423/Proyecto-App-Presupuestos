export interface Categoria {
  id: number;
  id_usuario: number;
  nombre: string;
  descripcion?: string;
  tipo_categoria: string;
  category_icon: string;
  color_format: string;
  ui_order: number;
  estado: string;
  creado_en: string;
  modificado_en?: string;
  creado_por?: number;
  modificado_por?: number;
}

export interface CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
  tipo_categoria: string;
  category_icon?: string;
  color_format?: string;
  ui_order?: number;
  estado?: string;
}

export interface CreateCategoriaResponseDTO {
  message: string;
  id_categoria?: number;
}

export type UpdateCategoriaDto = Partial<CreateCategoriaDto>;

export interface CategoriaListResponse {
  message: string;
  results?: Categoria[];
}
