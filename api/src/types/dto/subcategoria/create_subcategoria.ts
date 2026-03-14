export interface CreateSubcategoriaDto {
    categoria_id: number;
    nombre: string;
    descripcion?: string;
    is_default?: boolean;
    creado_por: number;
}
