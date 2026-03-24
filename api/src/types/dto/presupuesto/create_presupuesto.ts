import type { PresupuestoEstado } from '../../common/presupuesto.js';

export interface CreatePresupuestoDto {
    id_usuario: number;
    nombre_presupuesto: string;
    anio_inicio: number;
    mes_inicio: number;
    anio_fin: number;
    mes_fin: number;
    total_ingresos_planificados?: number | null;
    total_gastos_planificados?: number | null;
    total_ahorro_planificado?: number | null;
    fecha_creacion?: string | null;
    estado?: PresupuestoEstado | null;
    creado_en?: string | null;
    creado_por: number;
}
