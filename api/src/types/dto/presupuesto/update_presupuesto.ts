

export interface UpdatePresupuestoDto {
    id_usuario: number;
    nombre_presupuesto: string;
    anio_inicio: number;
    mes_inicio: number;
    anio_fin: number;
    mes_fin: number;
    total_ingresos_planificados: number;
    total_gastos_planificados: number;
    total_ahorro_planificado: number;
    estado: string;
    modificado_por: number;
}
