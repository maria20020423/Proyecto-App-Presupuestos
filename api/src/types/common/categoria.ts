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
