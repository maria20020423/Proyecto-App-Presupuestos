export interface ObligacionFija {
    id: number;
    id_usuario: number;
    subcategoria_id: number;
    nombre: string;
    descripcion?: string;
    dia_mes_expiracion: number;
    is_vigente: boolean;
    fecha_inicio: string;
    fecha_final?: string;
    creado_en: string;
    modificado_en?: string;
    creado_por?: number;
    modificado_por?: number;
}
