export interface CreateObligacionFijaDto {
    id_usuario: number;
    subcategoria_id: number;
    nombre: string;
    descripcion: string;
    dia_mes_expiracion: number;
    is_vigente: boolean;
    fecha_inicio: string;
    fecha_final: string;
    creado_por: number;
}
