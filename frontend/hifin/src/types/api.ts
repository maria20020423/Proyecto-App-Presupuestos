export * from "./common/common.types";
export * from "./dto/categoria.types";
export * from "./dto/subcategoria.types";
export * from "./dto/presupuesto.types";
export * from "./dto/detalle-presupuesto.types";

import { ApiResponse } from "./common/common.types";

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
