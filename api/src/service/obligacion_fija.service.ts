import type { Attachment } from 'node-firebird-driver-native';
import type { GetObligacionFijaResult } from '../types/dto/obligacion_fija/get_obligacion_fija_result.js';
import type { CreateObligacionFijaDto } from '../types/dto/obligacion_fija/create_obligacion_fija.js';
import type { UpdateObligacionFijaDto } from '../types/dto/obligacion_fija/update_obligacion_fija.js';

export default class ObligacionFijaService {
    private firebird_client: Attachment;

    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }

    public async getObligaciones(
        id_usuario: number | null,
        estado: boolean| null
    ): Promise<GetObligacionFijaResult[]> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                "SELECT * FROM SP_LISTAR_OBLIGACION_FIJA(?, ?);",   
                [id_usuario, estado]
            );
            const rows = await resultSet.fetchAsObject<GetObligacionFijaResult>();
            await resultSet.close();
            await transaction.commit();
            return rows;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error fetching obligaciones fijas: ${err}`);
        }
    }

    public async getObligacionById(id_obligacion: number): Promise<GetObligacionFijaResult | null> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                "SELECT * FROM SP_CONSULTAR_OBLIGACION_FIJA(?);",
                [id_obligacion]
            );
            const rows = await resultSet.fetchAsObject<GetObligacionFijaResult>();
            await resultSet.close();
            await transaction.commit();
            return rows.at(0) ?? null;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error fetching obligacion fija by id: ${err}`);
        }
    }

    public async createObligacion(obligacion: CreateObligacionFijaDto): Promise<number> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                "SELECT * FROM SP_INSERTAR_OBLIGACION_FIJA (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    obligacion.id_usuario,
                    obligacion.subcategoria_id,
                    obligacion.nombre,
                    obligacion.descripcion,
                    obligacion.dia_mes_expiracion,
                    obligacion.is_vigente,
                    new Date(obligacion.fecha_inicio),
                    new Date(obligacion.fecha_final),
                    obligacion.creado_por
                ]
            );
            const rows = await resultSet.fetch();
            await resultSet.close();
            await transaction.commit();
            if (!rows[0] || !rows[0][0]) {
                throw new Error('No se pudo obtener el ID de la obligacion fija creada');
            }
            return rows[0][0];
        } catch (err) {
            if (transaction) await transaction.rollback();
            throw new Error(`Error creating obligacion fija: ${err}`);
        }
    }

    public async updateObligacion(id_obligacion: number, obligacion: UpdateObligacionFijaDto): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                "EXECUTE PROCEDURE SP_ACTUALIZAR_OBLIGACION_FIJA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    id_obligacion,
                    obligacion.id_usuario,
                    obligacion.subcategoria_id,
                    obligacion.nombre,
                    obligacion.descripcion,
                    obligacion.dia_mes_expiracion,
                    obligacion.is_vigente,
                    new Date(obligacion.fecha_inicio),
                    new Date(obligacion.fecha_final),
                    obligacion.modificado_por
                ]
            );
            await transaction.commit();
        } catch (err) {
            if (transaction) await transaction.rollback();
            throw new Error(`Error updating obligacion fija: ${err}`);
        }
    }

    public async deleteObligacion(id_obligacion: number): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                "EXECUTE PROCEDURE SP_ELIMINAR_OBLIGACION_FIJA(?)",
                [id_obligacion]
            );
            await transaction.commit();
        } catch (err) {
            if (transaction) await transaction.rollback();
            throw new Error(`Error deleting obligacion fija: ${err}`);
        }
    }
}
