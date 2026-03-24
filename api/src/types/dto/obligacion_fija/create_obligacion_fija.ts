export interface CreateObligacionFijaDto {
    id_usuario: number;
    subcategoria_id: number;
    nombre: string;
    descripcion: string;
    dia_mes_expiracion: number;
    monto: number;
    is_vigente: boolean;
    fecha_inicio: string | null;
    fecha_final: string | null;
    creado_por: number;
}
