import type { Attachment } from 'node-firebird-driver-native';
import type { CrearPresupuestoCompletoDto, CrearPresupuestoCompletoResult } from '../types/dto/presupuesto/crear_presupuesto_completo.js';
import type { RegistrarTransaccionCompletaDto, RegistrarTransaccionCompletaResult } from '../types/dto/presupuesto/registrar_transaccion_completa.js';
import type { ObligacionMesResult } from '../types/dto/presupuesto/procesar_obligaciones_mes.js';
import type { BalanceMensualResult } from '../types/dto/presupuesto/balance_mensual.js';
import type { MontoEjecutadoMesResult } from '../types/dto/presupuesto/monto_ejecutado_mes.js';
import type { PorcentajeEjecucionMesResult } from '../types/dto/presupuesto/porcentaje_ejecucion_mes.js';
import type { CerrarPresupuestoDto, CerrarPresupuestoResult } from '../types/dto/presupuesto/cerrar_presupuesto.js';
import type { ResumenCategoriaMesResult } from '../types/dto/presupuesto/resumen_categoria_mes.js';

export default class PresupuestoNegocioService {
    private firebird_client: Attachment;

    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }

    /**
     * SP_CREAR_PRESUPUESTO_COMPLETO
     * Crea un presupuesto validando vigencia y solapamiento.
     * Retorna el id del presupuesto creado.
     */
    public async crearPresupuestoCompleto(dto: CrearPresupuestoCompletoDto): Promise<CrearPresupuestoCompletoResult> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                `EXECUTE PROCEDURE SP_CREAR_PRESUPUESTO_COMPLETO (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    dto.id_usuario,
                    dto.nombre,
                    dto.descripcion ?? null,
                    dto.anio_inicio,
                    dto.mes_inicio,
                    dto.anio_fin,
                    dto.mes_fin,
                    dto.total_ingresos,
                    dto.total_gastos,
                    dto.total_ahorro,
                    dto.creado_por,
                ]
            );
            const rows = await resultSet.fetchAsObject<CrearPresupuestoCompletoResult>();
            await resultSet.close();
            await transaction.commit();

            if (!rows[0]) {
                throw new Error('No se pudo obtener el ID del presupuesto creado');
            }
            return rows[0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error en sp_crear_presupuesto_completo: ${err}`);
        }
    }

    /**
     * SP_REGISTRAR_TRANSACCION_COMPLETA
     * Registra una transacción con todas las validaciones de negocio.
     * Retorna el id de la transacción y un mensaje de confirmación.
     */
    public async registrarTransaccionCompleta(dto: RegistrarTransaccionCompletaDto): Promise<RegistrarTransaccionCompletaResult> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                `EXECUTE PROCEDURE SP_REGISTRAR_TRANSACCION_COMPLETA (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    dto.id_usuario,
                    dto.id_presupuesto,
                    dto.anio,
                    dto.mes,
                    dto.id_subcategoria,
                    dto.id_obligacion ?? null,
                    dto.tipo,
                    dto.descripcion ?? null,
                    dto.monto,
                    new Date(dto.fecha),
                    dto.metodo_pago ?? null,
                    dto.no_factura ?? null,
                    dto.observaciones ?? null,
                    dto.creado_por,
                ]
            );
            const rows = await resultSet.fetchAsObject<RegistrarTransaccionCompletaResult>();
            await resultSet.close();
            await transaction.commit();

            if (!rows[0]) {
                throw new Error('No se pudo registrar la transacción');
            }
            return rows[0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error en sp_registrar_transaccion_completa: ${err}`);
        }
    }

    /**
     * SP_PROCESAR_OBLIGACIONES_MES
     * Devuelve las obligaciones activas del usuario para el mes/año indicado
     * con su estado de alerta (vencida, por_vencer, programada, etc.).
     */
    public async procesarObligacionesMes(
        id_usuario: number,
        anio: number,
        mes: number,
        id_presupuesto: number
    ): Promise<ObligacionMesResult[]> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                `SELECT * FROM SP_PROCESAR_OBLIGACIONES_MES(?, ?, ?, ?)`,
                [id_usuario, anio, mes, id_presupuesto]
            );
            const rows = await resultSet.fetchAsObject<ObligacionMesResult>();
            await resultSet.close();
            await transaction.commit();
            return rows;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error en sp_procesar_obligaciones_mes: ${err}`);
        }
    }

    /**
     * SP_CALCULAR_BALANCE_MENSUAL
     * Calcula el resumen financiero de un mes: ingresos, gastos, ahorros y balance.
     */
    public async calcularBalanceMensual(
        id_usuario: number,
        id_presupuesto: number,
        anio: number,
        mes: number
    ): Promise<BalanceMensualResult> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                `EXECUTE PROCEDURE SP_CALCULAR_BALANCE_MENSUAL(?, ?, ?, ?)`,
                [id_usuario, id_presupuesto, anio, mes]
            );
            const rows = await resultSet.fetchAsObject<BalanceMensualResult>();
            await resultSet.close();
            await transaction.commit();

            if (!rows[0]) {
                throw new Error('No se pudo calcular el balance mensual');
            }
            return rows[0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error en sp_calcular_balance_mensual: ${err}`);
        }
    }

    /**
     * SP_CALCULAR_MONTO_EJECUTADO_MES
     * Suma todas las transacciones de una subcategoría para un mes específico.
     */
    public async calcularMontoEjecutadoMes(
        id_subcategoria: number,
        id_presupuesto: number,
        anio: number,
        mes: number
    ): Promise<MontoEjecutadoMesResult> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                `EXECUTE PROCEDURE SP_CALCULAR_MONTO_EJECUTADO_MES(?, ?, ?, ?)`,
                [id_subcategoria, id_presupuesto, anio, mes]
            );
            const rows = await resultSet.fetchAsObject<MontoEjecutadoMesResult>();
            await resultSet.close();
            await transaction.commit();

            if (!rows[0]) {
                throw new Error('No se pudo calcular el monto ejecutado');
            }
            return rows[0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error en sp_calcular_monto_ejecutado_mes: ${err}`);
        }
    }

    /**
     * SP_CALCULAR_PORCENTAJE_EJECUCION_MES
     * Calcula el porcentaje ejecutado comparando monto ejecutado vs monto presupuestado.
     */
    public async calcularPorcentajeEjecucionMes(
        id_subcategoria: number,
        id_presupuesto: number,
        anio: number,
        mes: number
    ): Promise<PorcentajeEjecucionMesResult> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                `EXECUTE PROCEDURE SP_CALCULAR_PORCENTAJE_EJECUCION_MES(?, ?, ?, ?)`,
                [id_subcategoria, id_presupuesto, anio, mes]
            );
            const rows = await resultSet.fetchAsObject<PorcentajeEjecucionMesResult>();
            await resultSet.close();
            await transaction.commit();

            if (!rows[0]) {
                throw new Error('No se pudo calcular el porcentaje de ejecución');
            }
            return rows[0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error en sp_calcular_porcentaje_ejecucion_mes: ${err}`);
        }
    }

    /**
     * SP_CERRAR_PRESUPUESTO
     * Marca un presupuesto como cerrado (valida que la fecha fin haya pasado)
     * y retorna el resumen de ejecución total.
     */
    public async cerrarPresupuesto(
        id_presupuesto: number,
        dto: CerrarPresupuestoDto
    ): Promise<CerrarPresupuestoResult> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                `EXECUTE PROCEDURE SP_CERRAR_PRESUPUESTO(?, ?)`,
                [id_presupuesto, dto.modificado_por]
            );
            const rows = await resultSet.fetchAsObject<CerrarPresupuestoResult>();
            await resultSet.close();
            await transaction.commit();

            if (!rows[0]) {
                throw new Error('No se pudo cerrar el presupuesto');
            }
            return rows[0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error en sp_cerrar_presupuesto: ${err}`);
        }
    }

    /**
     * SP_OBTENER_RESUMEN_CATEGORIA_MES
     * Calcula el resumen de una categoría sumando todas sus subcategorías para un mes.
     * Retorna monto presupuestado, monto ejecutado y porcentaje.
     */
    public async obtenerResumenCategoriaMes(
        id_categoria: number,
        id_presupuesto: number,
        anio: number,
        mes: number
    ): Promise<ResumenCategoriaMesResult> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                `EXECUTE PROCEDURE SP_OBTENER_RESUMEN_CATEGORIA_MES(?, ?, ?, ?)`,
                [id_categoria, id_presupuesto, anio, mes]
            );
            const rows = await resultSet.fetchAsObject<ResumenCategoriaMesResult>();
            await resultSet.close();
            await transaction.commit();

            if (!rows[0]) {
                throw new Error('No se pudo obtener el resumen de la categoría');
            }
            return rows[0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error en sp_obtener_resumen_categoria_mes: ${err}`);
        }
    }
}
