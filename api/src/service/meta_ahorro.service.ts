import type { Attachment } from 'node-firebird-driver-native';
import type { GetMetaAhorroResult } from '../types/dto/meta_ahorro/get_meta_ahorro_result.js';
import type { CreateMetaAhorroDto } from '../types/dto/meta_ahorro/create_meta_ahorro.js';
import type { UpdateMetaAhorroDto } from '../types/dto/meta_ahorro/update_meta_ahorro.js';

export default class MetaAhorroService {
    private firebird_client: Attachment;

    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }

    public async getMetas(id_usuario?: number): Promise<GetMetaAhorroResult[]> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_LISTAR_META_AHORRO;'
            );
            const rows = await resultSet.fetchAsObject<GetMetaAhorroResult>();
            await resultSet.close();
            await transaction.commit();
            if (typeof id_usuario === 'number') {
                return rows.filter((row) => row.id_usuario === id_usuario);
            }
            return rows;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error fetching metas de ahorro: ${err}`);
        }
    }

    public async getMetaById(id_meta_ahorro: number, id_usuario?: number): Promise<GetMetaAhorroResult | null> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_CONSULTAR_META_AHORRO(?);',
                [id_meta_ahorro]
            );
            const rows = await resultSet.fetchAsObject<GetMetaAhorroResult>();
            await resultSet.close();
            await transaction.commit();
            const meta = rows.at(0) ?? null;
            if (meta && typeof id_usuario === 'number' && meta.id_usuario !== id_usuario) {
                return null;
            }
            return meta;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error fetching meta de ahorro: ${err}`);
        }
    }

    public async createMeta(meta: CreateMetaAhorroDto): Promise<number> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_INSERTAR_META_AHORRO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [
                    meta.id_usuario,
                    meta.nombre,
                    meta.descripcion ?? null,
                    meta.monto_objetivo,
                    meta.monto_acumulado ?? 0,
                    meta.fecha_objetivo ? new Date(meta.fecha_objetivo) : null,
                    meta.estado ?? 'activo',
                    meta.prioridad ?? 3,
                    meta.promedio_ahorro_mensual ?? null,
                    meta.fecha_inicio ? new Date(meta.fecha_inicio) : null,
                    meta.fecha_completada ? new Date(meta.fecha_completada) : null,
                    meta.creado_por ?? null
                ]
            );
            const rows = await resultSet.fetch();
            await resultSet.close();
            await transaction.commit();
            if (!rows[0] || !rows[0][0]) {
                throw new Error('No se pudo obtener el ID de la meta de ahorro creada');
            }
            return rows[0][0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error creating meta de ahorro: ${err}`);
        }
    }

    public async updateMeta(id_meta_ahorro: number, meta: UpdateMetaAhorroDto): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                'EXECUTE PROCEDURE SP_ACTUALIZAR_META_AHORRO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                [
                    id_meta_ahorro,
                    meta.id_usuario,
                    meta.nombre,
                    meta.descripcion ?? null,
                    meta.monto_objetivo,
                    meta.monto_acumulado,
                    meta.fecha_objetivo ? new Date(meta.fecha_objetivo) : null,
                    meta.estado,
                    meta.prioridad,
                    meta.promedio_ahorro_mensual ?? null,
                    meta.fecha_inicio ? new Date(meta.fecha_inicio) : null,
                    meta.fecha_completada ? new Date(meta.fecha_completada) : null,
                    meta.modificado_por
                ]
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error updating meta de ahorro: ${err}`);
        }
    }

    public async deleteMeta(id_meta_ahorro: number): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                'EXECUTE PROCEDURE SP_ELIMINAR_META_AHORRO(?);',
                [id_meta_ahorro]
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error deleting meta de ahorro: ${err}`);
        }
    }
}
