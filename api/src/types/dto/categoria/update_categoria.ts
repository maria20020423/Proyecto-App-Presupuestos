export interface UpdateCategoriaDto {
    nombre?: string;
    descripcion?: string;
    category_icon?: string;
    color_format?: string;
    ui_order?: number;
    estado?: 'activa' | 'inactiva';
    modificado_por: number;
}
