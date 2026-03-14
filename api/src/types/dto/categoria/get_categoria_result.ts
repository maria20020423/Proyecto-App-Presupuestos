export interface GetCategoriaResult {
    id: number;
    id_usuario: number;
    nombre: string;
    descripcion?: string;
    tipo_categoria: 'ingreso' | 'gasto' | 'ahorro';
    category_icon?: string;
    color_format?: string;
    ui_order: number;
    estado: 'activa' | 'inactiva';
    creado_en: string;
    modificado_en?: string;
    creado_por?: number;
    modificado_por?: number;
}
