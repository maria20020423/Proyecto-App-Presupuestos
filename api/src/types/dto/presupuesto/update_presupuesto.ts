

import type { PresupuestoEstado } from '../../common/presupuesto.js';

export interface UpdatePresupuestoDto {
    id_usuario?: number | null;
    nombre_presupuesto?: string | null;
    anio_inicio?: number | null;
    mes_inicio?: number | null;
    anio_fin?: number | null;
    mes_fin?: number | null;
    total_ingresos_planificados?: number | null;
    total_gastos_planificados?: number | null;
    total_ahorro_planificado?: number | null;
    estado?: PresupuestoEstado | null;
    modificado_por: number;
}
