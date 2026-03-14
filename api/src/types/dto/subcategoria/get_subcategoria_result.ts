export interface GetSubcategoriaResult {
    id: number;
    categoria_id: number;
    categoria_nombre: string;
    tipo_categoria: 'ingreso' | 'gasto' | 'ahorro';
    nombre: string;
    descripcion?: string;
    is_default: boolean;
    estado: 'activa' | 'inactiva';
    creado_en: string;
    modificado_en?: string;
    creado_por?: number;
    modificado_por?: number;
}
