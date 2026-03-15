import type { Attachment } from 'node-firebird-driver-native';
import type { GetPresupuestoResult } from '../types/dto/presupuesto/get_presupuesto_result.js';
import type { CreatePresupuestoDto } from '../types/dto/presupuesto/create_presupuesto.js';
import type { UpdatePresupuestoDto } from '../types/dto/presupuesto/update_presupuesto.js';
import type { PresupuestoEstado } from '../types/common/presupuesto.js';

const ESTADOS_VALIDOS: PresupuestoEstado[] = ['activo', 'cerrado', 'borrador'];
export default class PresupuestoService {
    private firebird_client: Attachment;

    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }

    public async getPresupuestos(id_usuario: number, estado?: string): Promise<GetPresupuestoResult[]> {
        if (Number.isNaN(id_usuario)) {
            throw new Error('id_usuario invalido');
        }

        let estadoParam: PresupuestoEstado | null = null;
        if (estado) {
            if (!ESTADOS_VALIDOS.includes(estado as PresupuestoEstado)) {
                throw new Error('estado invalido');
            }
            estadoParam = estado as PresupuestoEstado;
        }

        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                "SELECT * FROM SP_LISTAR_PRESUPUESTOS(?, ?);",
                [id_usuario, estadoParam]
            );
            const rows = await resultSet.fetchAsObject<GetPresupuestoResult>();
            await resultSet.close();
            await transaction.commit();
            return rows;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error fetching presupuestos: ${err}`);
        }
    }

    public async createPresupuesto(presupuesto: CreatePresupuestoDto): Promise<number> {
        this.validatePeriodo(
            presupuesto.anio_inicio,
            presupuesto.mes_inicio,
            presupuesto.anio_fin,
            presupuesto.mes_fin
        );
        this.validateTotales(
            presupuesto.total_ingresos_planificados,
            presupuesto.total_gastos_planificados,
            presupuesto.total_ahorro_planificado
        );

        const transaction = await this.firebird_client.startTransaction();
        try {
            const parameters = [
                presupuesto.id_usuario,
                presupuesto.nombre_presupuesto,
                presupuesto.anio_inicio,
                presupuesto.mes_inicio,
                presupuesto.anio_fin,
                presupuesto.mes_fin,
                presupuesto.total_ingresos_planificados,
                presupuesto.total_gastos_planificados,
                presupuesto.total_ahorro_planificado,
                new Date(presupuesto.fecha_creacion),
                presupuesto.estado,
                new Date(presupuesto.creado_en),
                presupuesto.creado_por
            ];

            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                `EXECUTE PROCEDURE SP_INSERTAR_PRESUPUESTO (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                )`,
                parameters
            );

            const rows = await resultSet.fetch();
            await resultSet.close();
            await transaction.commit();
                if (!rows[0] || !rows[0][0]) {
                throw new Error('No se pudo obtener el ID de la categoria creada');
            }
            return rows[0][0];
        } catch (err) {
            if (transaction) await transaction.rollback();
            throw new Error(`Error creating presupuesto: ${err}`);
        }
    }

    public async getPresupuestoById(id_presupuesto: number): Promise<GetPresupuestoResult> {
        if (Number.isNaN(id_presupuesto)) {
            throw new Error('id_presupuesto invalido');
        }
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                "SELECT * FROM SP_CONSULTAR_PRESUPUESTO(?)",
                [id_presupuesto]
            );
            const rows = await resultSet.fetchAsObject<GetPresupuestoResult>();
            await resultSet.close();
            await transaction.commit();

            if (rows.length === 0) {
                throw new Error("Presupuesto not found");
            }

            return rows.at(0)!;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error fetching presupuesto: ${err}`);
        }
    }

    public async updatePresupuesto(id_presupuesto: number, presupuesto: UpdatePresupuestoDto): Promise<void> {
        if (Number.isNaN(id_presupuesto)) {
            throw new Error('id_presupuesto invalido');
        }
        this.validatePeriodo(
            presupuesto.anio_inicio,
            presupuesto.mes_inicio,
            presupuesto.anio_fin,
            presupuesto.mes_fin
        );
        this.validateTotales(
            presupuesto.total_ingresos_planificados,
            presupuesto.total_gastos_planificados,
            presupuesto.total_ahorro_planificado
        );

        const transaction = await this.firebird_client.startTransaction();
        try {
            const parameters = [
                id_presupuesto,
                presupuesto.id_usuario,
                presupuesto.nombre_presupuesto,
                presupuesto.anio_inicio,
                presupuesto.mes_inicio,
                presupuesto.anio_fin,
                presupuesto.mes_fin,
                presupuesto.total_ingresos_planificados,
                presupuesto.total_gastos_planificados,
                presupuesto.total_ahorro_planificado,
                presupuesto.estado,
                new Date(),
                presupuesto.modificado_por

            ];

            await this.firebird_client.execute(
                transaction,
                `EXECUTE PROCEDURE SP_ACTUALIZAR_PRESUPUESTO (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                )`,
                parameters
            );

            await transaction.commit();
        } catch (err) {
            if (transaction) await transaction.rollback();
            throw new Error(`Error updating presupuesto: ${err}`);
        }
    }
    public async deletePresupuesto(id_presupuesto: number): Promise<void> {
        if (Number.isNaN(id_presupuesto)) {
            throw new Error('id_presupuesto invalido');
        }
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                "EXECUTE PROCEDURE SP_ELIMINAR_PRESUPUESTO(?)",
                [id_presupuesto]
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error deleting presupuesto: ${err}`);
        }
    }

    private validatePeriodo(anio_inicio: number, mes_inicio: number, anio_fin: number, mes_fin: number): void {
        if (anio_fin < anio_inicio) {
            throw new Error('anio_fin debe ser mayor o igual al anio_inicio');
        }
        if (anio_fin === anio_inicio && mes_fin < mes_inicio) {
            throw new Error('mes_fin debe ser mayor o igual al mes_inicio cuando anios son iguales');
        }
    }

    private validateTotales(total_ingresos: number, total_gastos: number, total_ahorro: number): void {
        if (total_ingresos < total_gastos + total_ahorro) {
            throw new Error('El total de ingresos debe ser mayor o igual a la suma de gastos y ahorro planificados');
        }
    }
}
