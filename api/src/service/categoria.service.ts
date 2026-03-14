import type { Attachment } from 'node-firebird-driver-native';
import type { GetCategoriaResult } from '../types/dto/categoria/get_categoria_result.js';
import type { CreateCategoriaDto } from '../types/dto/categoria/create_categoria.js';
import type { UpdateCategoriaDto } from '../types/dto/categoria/update_categoria.js';

export default class CategoriaService {
    private firebird_client: Attachment;

    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }

    public async listCategorias(id_usuario: number, tipo_categoria?: string): Promise<GetCategoriaResult[]> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_LISTAR_CATEGORIAS(?, ?);',
                [id_usuario, tipo_categoria ?? null]
            );
            const rows = await resultSet.fetchAsObject<GetCategoriaResult>();
            await resultSet.close();
            await transaction.commit();
            return rows;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error listing categorias: ${err}`);
        }
    }

    public async getCategoriaById(id_categoria: number): Promise<GetCategoriaResult | null> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_CONSULTAR_CATEGORIA(?);',
                [id_categoria]
            );
            const rows = await resultSet.fetchAsObject<GetCategoriaResult>();
            await resultSet.close();
            await transaction.commit();
            return rows.at(0) ?? null;
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error fetching categoria: ${err}`);
        }
    }

    public async createCategoria(categoria: CreateCategoriaDto): Promise<number> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const parameters = [
                categoria.id_usuario,
                categoria.nombre,
                categoria.descripcion ?? null,
                categoria.tipo_categoria,
                categoria.category_icon ?? null,
                categoria.color_format ?? null,
                categoria.ui_order ?? 0,
                categoria.estado ?? 'activa',
                categoria.creado_por
            ];

            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                'SELECT * FROM SP_INSERTAR_CATEGORIA(?, ?, ?, ?, ?, ?, ?, ?, ?);',
                parameters
            );
            const rows = await resultSet.fetch();
            await resultSet.close();
            await transaction.commit();
            return rows[0][0];
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error creating categoria: ${err}`);
        }
    }

    public async updateCategoria(id_categoria: number, categoria: UpdateCategoriaDto): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                'EXECUTE PROCEDURE SP_ACTUALIZAR_CATEGORIA(?, ?, ?, ?, ?, ?, ?, ?);',
                [
                    id_categoria,
                    categoria.nombre ?? null,
                    categoria.descripcion ?? null,
                    categoria.category_icon ?? null,
                    categoria.color_format ?? null,
                    categoria.ui_order ?? null,
                    categoria.estado ?? null,
                    categoria.modificado_por
                ]
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error updating categoria: ${err}`);
        }
    }

    public async deleteCategoria(id_categoria: number): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                'EXECUTE PROCEDURE SP_ELIMINAR_CATEGORIA(?);',
                [id_categoria]
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw new Error(`Error deleting categoria: ${err}`);
        }
    }
}
