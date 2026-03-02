import type { Attachment } from 'node-firebird-driver-native';
import type { GetPresupuestoResult } from '../types/dto/presupuesto/get_presupuesto_result.js';
import type { CreatePresupuestoDto } from '../types/dto/presupuesto/create_presupuesto.js';
import type { UpdatePresupuestoDto } from '../types/dto/presupuesto/update_presupuesto.js';
export default class PresupuestoService {
    private firebird_client: Attachment;

    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }

    public async getPresupuestos(id_usuario: number, estado: string): Promise<GetPresupuestoResult[]> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                "SELECT * FROM SP_LISTAR_PRESUPUESTOS(?, ?);",
                [id_usuario, estado]
            );
            const rows = await resultSet.fetchAsObject<GetPresupuestoResult>();
            await resultSet.close();
            await transaction.commit();
            return rows;
        } catch (err) {
            throw new Error(`Error fetching presupuesto: ${err}`);
        }
    }

    public async createPresupuesto(presupuesto: CreatePresupuestoDto): Promise<void> {
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

            await this.firebird_client.execute(
                transaction,
                `EXECUTE PROCEDURE SP_INSERTAR_PRESUPUESTO (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                )`,
                parameters
            );

            await transaction.commit();
            return void 0;
        } catch (err) {
            if (transaction) await transaction.rollback();
            throw new Error(`Error creating presupuesto: ${err}`);
        }
    }

    public async getPresupuestoById(id_presupuesto: number): Promise<GetPresupuestoResult> {
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
            throw new Error(`Error fetching presupuesto: ${err}`);
        }
    }

    public async updatePresupuesto(id_presupuesto: number, presupuesto: UpdatePresupuestoDto): Promise<void> {
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
                   ?,?,?,?,?,?
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
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                "EXECUTE PROCEDURE SP_ELIMINAR_PRESUPUESTO(?)",
                [id_presupuesto]
            );
            await transaction.commit();
        } catch (err) {
            throw new Error(`Error deleting presupuesto: ${err}`);
        }
    }
}