import type { Attachment } from 'node-firebird-driver-native';
import type { CreateDetallePresupuestoDto } from '../types/dto/detalle_presupuesto/create_detalle_presupuesto.js';
import type { UpdateDetallePresupuestoDto } from '../types/dto/detalle_presupuesto/update_detalle_presupuesto.js';
import type { GetDetallePresupuestoResult } from '../types/dto/detalle_presupuesto/get_detalle_presupuesto_result.js';

export default class DetallePresupuestoService {
    private firebird_client: Attachment;

    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }

    public async listByPresupuesto(presupuesto_id: number): Promise<GetDetallePresupuestoResult[]> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_LISTAR_DETALLE_PRESUPUESTO(?);',
                [presupuesto_id]
            );
            const rows = await resultSet.fetchAsObject<GetDetallePresupuestoResult>();
            await resultSet.close();
            await transaction.commit();
            return rows;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error listing detalle presupuesto: ${err}`);
        }
    }

    public async getById(detalle_id: number): Promise<GetDetallePresupuestoResult | null> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_CONSULTAR_DETALLE_PRESUPUESTO(?);',
                [detalle_id]
            );
            const rows = await resultSet.fetchAsObject<GetDetallePresupuestoResult>();
            await resultSet.close();
            await transaction.commit();
            return rows.at(0) ?? null;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error getting detalle presupuesto: ${err}`);
        }
    }

    public async create(detalle: CreateDetallePresupuestoDto): Promise<number> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_INSERTAR_DETALLE_PRESUPUESTO(?, ?, ?, ?, ?);',
                [
                    detalle.presupuesto_id,
                    detalle.subcategoria_id,
                    detalle.monto_mensual,
                    detalle.observaciones ?? null,
                    detalle.creado_por
                ]
            );
            const rows = await resultSet.fetch();
            await resultSet.close();
            await transaction.commit();
            if (!rows[0] || rows[0][0] === undefined || rows[0][0] === null) {
                throw new Error('No se pudo obtener el ID del detalle creado');
            }
            return rows[0][0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error creating detalle presupuesto: ${err}`);
        }
    }

    public async update(detalle_id: number, detalle: UpdateDetallePresupuestoDto): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                'EXECUTE PROCEDURE SP_ACTUALIZAR_DETALLE_PRESUPUESTO(?, ?, ?, ?);',
                [
                    detalle_id,
                    detalle.monto_mensual,
                    detalle.observaciones ?? null,
                    detalle.modificado_por
                ]
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error updating detalle presupuesto: ${err}`);
        }
    }

    public async delete(detalle_id: number, modificado_por: number): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                'EXECUTE PROCEDURE SP_ELIMINAR_DETALLE_PRESUPUESTO(?, ?);',
                [detalle_id, modificado_por]
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error deleting detalle presupuesto: ${err}`);
        }
    }
}
