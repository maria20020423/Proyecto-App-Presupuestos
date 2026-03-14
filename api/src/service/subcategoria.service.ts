import type { Attachment } from 'node-firebird-driver-native';
import type { CreateSubcategoriaDto } from '../types/dto/subcategoria/create_subcategoria.js';
import type { UpdateSubcategoriaDto } from '../types/dto/subcategoria/update_subcategoria.js';
import type { GetSubcategoriaResult } from '../types/dto/subcategoria/get_subcategoria_result.js';

export default class SubcategoriaService {
    private firebird_client: Attachment;

    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }

    public async listByCategoria(categoria_id: number): Promise<GetSubcategoriaResult[]> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_LISTAR_SUBCATEGORIAS_POR_CATEGORIA(?);',
                [categoria_id]
            );
            const rows = await resultSet.fetchAsObject<GetSubcategoriaResult>();
            await resultSet.close();
            await transaction.commit();
            return rows;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error listing subcategorias: ${err}`);
        }
    }

    public async getById(id_subcategoria: number): Promise<GetSubcategoriaResult | null> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_CONSULTAR_SUBCATEGORIA(?);',
                [id_subcategoria]
            );
            const rows = await resultSet.fetchAsObject<GetSubcategoriaResult>();
            await resultSet.close();
            await transaction.commit();
            return rows.at(0) ?? null;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error fetching subcategoria: ${err}`);
        }
    }

    public async create(subcategoria: CreateSubcategoriaDto): Promise<number> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_INSERTAR_SUBCATEGORIA(?, ?, ?, ?, ?);',
                [
                    subcategoria.categoria_id,
                    subcategoria.nombre,
                    subcategoria.descripcion ?? null,
                    subcategoria.is_default ?? false,
                    subcategoria.creado_por
                ]
            );
            const rows = await resultSet.fetch();
            await resultSet.close();
            await transaction.commit();
            return rows[0][0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error creating subcategoria: ${err}`);
        }
    }

    public async update(id_subcategoria: number, subcategoria: UpdateSubcategoriaDto): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                'EXECUTE PROCEDURE SP_ACTUALIZAR_SUBCATEGORIA(?, ?, ?, ?, ?);',
                [
                    id_subcategoria,
                    subcategoria.nombre ?? null,
                    subcategoria.descripcion ?? null,
                    subcategoria.estado ?? null,
                    subcategoria.modificado_por
                ]
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error updating subcategoria: ${err}`);
        }
    }

    public async delete(id_subcategoria: number): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                'EXECUTE PROCEDURE SP_ELIMINAR_SUBCATEGORIA(?);',
                [id_subcategoria]
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error deleting subcategoria: ${err}`);
        }
    }
}
