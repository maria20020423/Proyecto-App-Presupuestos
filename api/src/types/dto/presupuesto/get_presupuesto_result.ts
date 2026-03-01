export interface GetPresupuestoResult {
    id_presupuesto: number;
    id_usuario: number;
    nombre_presupuesto: string;
    anio_inicio: number;
    mes_inicio: number;
    anio_fin: number;
    mes_fin: number;
    total_ingresos_planificados: number;
    total_gastos_planificados: number;
    total_ahorro_planificado: number;
    fecha_creacion: string;
    estado: string;
    creado_en: string;
    modificado_en?: string;
    creado_por?: number;
    modificado_por?: number;
}

