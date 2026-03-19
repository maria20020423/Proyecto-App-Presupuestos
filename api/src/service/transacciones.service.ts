import type { Attachment } from 'node-firebird-driver-native';
import type { GetTransaccionResult } from '../types/dto/transacciones/get_transaccion_result.js';
import type { CreateTransaccionDto } from '../types/dto/transacciones/create_transaccion.js';
import type { UpdateTransaccionDto } from '../types/dto/transacciones/update_transaccion.js';

export default class TransaccionesService {
    private firebird_client: Attachment;

    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }

    // SELECT - returns array of all transactions
    public async getTransacciones(): Promise<GetTransaccionResult[]> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                "SELECT * FROM SP_LISTAR_TRANSACCIONES;"
            );
            const rows = await resultSet.fetchAsObject<GetTransaccionResult>();
            await resultSet.close();
            await transaction.commit();
            return rows;
        } catch (err) {
            throw new Error(`Error fetching transacciones: ${err}`);
        }
    }

    // SELECT by ID - returns single transaction
    public async getTransaccionById(id_transacciones: number): Promise<GetTransaccionResult[]> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                "SELECT * FROM SP_CONSULTAR_TRANSACCIONES(?);",
                [id_transacciones]
            );
            const rows = await resultSet.fetchAsObject<GetTransaccionResult>();
            await resultSet.close();
            await transaction.commit();
            return rows;
        } catch (err) {
            throw new Error(`Error fetching transaccion: ${err}`);
        }
    }

    // INSERT - execute procedure
    public async createTransaccion(transaccion: CreateTransaccionDto): Promise<number> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                "SELECT * FROM SP_INSERTAR_TRANSACCIONES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    transaccion.id_usuario,
                    transaccion.presupuesto_id,
                    transaccion.anio,
                    transaccion.mes,
                    transaccion.subcategoria_id,
                    transaccion.obligacion_id,
                    transaccion.tipo,
                    transaccion.descripcion,
                    transaccion.monto,
                    transaccion.fecha,
                    transaccion.metodo_pago,
                    transaccion.no_factura,
                    transaccion.observaciones,
                    transaccion.creado_por
                ]
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
            throw new Error(`Error creating transaccion: ${err}`);
        }
    }

    // UPDATE - execute procedure
    public async updateTransaccion(id_transacciones: number, transaccion: UpdateTransaccionDto): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                "EXECUTE PROCEDURE SP_ACTUALIZAR_TRANSACCIONES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    id_transacciones,
                    transaccion.id_usuario,
                    transaccion.presupuesto_id,
                    transaccion.anio,
                    transaccion.mes,
                    transaccion.subcategoria_id,
                    transaccion.obligacion_id,
                    transaccion.tipo,
                    transaccion.descripcion,
                    transaccion.monto,
                    transaccion.fecha,
                    transaccion.metodo_pago,
                    transaccion.no_factura,
                    transaccion.observaciones,
                    transaccion.estado,
                    transaccion.modificado_por
                ]
            );
            await transaction.commit();
        } catch (err) {
            if (transaction) await transaction.rollback();
            throw new Error(`Error updating transaccion: ${err}`);
        }
    }

    // DELETE - execute procedure (soft delete)
    public async deleteTransaccion(id_transacciones: number, modificado_por: number): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                "EXECUTE PROCEDURE SP_ELIMINAR_TRANSACCIONES(?, ?)",
                [id_transacciones, modificado_por]
            );
            await transaction.commit();
        } catch (err) {
            throw new Error(`Error deleting transaccion: ${err}`);
        }
    }
}
