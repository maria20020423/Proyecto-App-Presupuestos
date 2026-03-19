export interface GetObligacionFijaResult {
    id: number;
    id_usuario: number;
    subcategoria_id: number;
    nombre: string;
    descripcion: string;
    dia_mes_expiracion: number;
    is_vigente: boolean;
    fecha_inicio: Date;
    fecha_final: Date;
    creado_en: Date;
    modificado_en: Date | null;
    creado_por: number;
    modificado_por: number | null;
}
