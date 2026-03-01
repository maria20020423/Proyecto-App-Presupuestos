export interface Subcategoria {
    id: number;
    categoria_id: number;
    nombre: string;
    descripcion?: string;
    is_default: boolean;
    creado_en: string;
    modificado_en?: string;
    creado_por?: number;
    modificado_por?: number;
}
