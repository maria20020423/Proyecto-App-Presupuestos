export interface CreateCategoriaDto {
    id_usuario: number;
    nombre: string;
    descripcion?: string;
    tipo_categoria: 'ingreso' | 'gasto' | 'ahorro';
    category_icon?: string;
    color_format?: string;
    ui_order?: number;
    estado?: 'activa' | 'inactiva';
    creado_por: number;
}
