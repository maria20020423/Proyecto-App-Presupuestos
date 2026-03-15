export interface ApiResponse<T = unknown> {
  message: string;
  [key: string]: T | string;
}

export interface LoginDTO {
  correo: string;
  contrasena: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  salario_mensual_base: number;
  estado: string;
}

export interface LoginResponseDTO extends ApiResponse {
  usuario: Usuario;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo_categoria: number;
  category_icon: string;
  color_format: string;
  ui_order: number;
  creado_en: string;
  modificado_en?: string;
  creado_por?: number;
  modificado_por?: number;
}

export interface CreateCategoriaDto {
  id_usuario: number;
  nombre: string;
  descripcion?: string;
  tipo_categoria: number;
  category_icon?: string;
  color_format?: string;
}

export type UpdateCategoriaDto = Partial<CreateCategoriaDto>;

export interface CategoriaListResponse extends ApiResponse {
  results?: Categoria[];
}