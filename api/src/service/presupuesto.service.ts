import type { RequestHandler } from 'express';
import type { Attachment } from 'node-firebird-driver-native'
import type { GetPresupuestoResult } from '../types/dto/presupuesto/get_presupuesto_result.js';
import type { CreatePresupuestoDto } from '../types/dto/presupuesto/create_presupuesto.js';
import type { ZonedDate } from 'node-firebird-driver-native';

const dateToStr = (val: string | Date) => {
    const d = new Date(val);
    return d.toISOString().replace('T', ' ').replace('Z', ' UTC');
};
export default class PresupuestoService {
    private firebird_client: Attachment;
    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }

    public async getPresupuestos(id_usuario: number, estado: string): Promise<any> {
        const transaction = await this.firebird_client.startTransaction();


        try {
            const resultSet = await this.firebird_client.executeQuery(transaction, "SELECT * FROM SP_LISTAR_PRESUPUESTOS(?, ?);", [id_usuario, estado]);
            const rows = await resultSet.fetch();
            await resultSet.close();
            await transaction.commit();
            return rows;

        } catch (err) {
            throw new Error("Error fetching presupuesto: " + err);
        }
    }




    public async createPresupuesto(presupuesto: CreatePresupuestoDto): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            // Helper to ensure dates are in the "YYYY-MM-DD HH:mm:ss UTC" format
            const dateToStr = (val: string | Date) => {
                const d = new Date(val);
                return d.toISOString().replace('T', ' ').replace('Z', ' UTC');
            };

            // Convert everything to strings to bypass driver type-guessing
            const parameters = [
                presupuesto.id_usuario,
                presupuesto.nombre_presupuesto,
                presupuesto.anio_inicio,
                presupuesto.mes_inicio,
                presupuesto.anio_fin,
                presupuesto.mes_fin,
                presupuesto.total_ingresos_planificados, // "120000.00"
                presupuesto.total_gastos_planificados,   // "90000.00"
                presupuesto.total_ahorro_planificado,    // "30000.00"
                dateToStr(presupuesto.fecha_creacion),
                presupuesto.estado,
                dateToStr(presupuesto.creado_en),
                presupuesto.creado_por
            ];

            console.log("Sending String-Safe Parameters:", parameters);

            await this.firebird_client.execute(
                transaction,
                `EXECUTE PROCEDURE SP_INSERTAR_PRESUPUESTO (
        ?,     
        ?,            
        ?,     
        ?,      
        ?,        
        ?,   
        ?, 
        ?, 
        ?,  
        CAST(CAST(? AS VARCHAR(100)) AS TIMESTAMP), -- fecha_creacion
        ?, 
        CAST(CAST(? AS VARCHAR(100)) AS TIMESTAMP), -- creado_en
        ?                  -- creado_por
    )`,
                parameters // Keep using the array of strings we prepared
            );

            await transaction.commit();
            console.log("✅ Insertion successful using String-Safe method.");

        } catch (err: any) {
            if (transaction) await transaction.rollback();
            console.error("❌ Test failed even with strings:", err);
            throw err;
        }
    }

    public async getPresupuestoById(id_presupuesto: number): Promise<GetPresupuestoResult> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            const resultSet = await this.firebird_client.executeQuery(transaction, "EXECUTE PROCEDURE SP_CONSULTAR_PRESUPUESTO(?)", [id_presupuesto]);
            const rows = await resultSet.fetchAsObject<GetPresupuestoResult>();
            await resultSet.close();
            await transaction.commit();
            if (rows.length === 0) {
                throw new Error("Presupuesto not found");
            }
            return rows.at(0) as GetPresupuestoResult;
        } catch (err) {
            throw new Error("Error fetching presupuesto: " + err);
        }
    }


    public async deletePresupuesto(id_presupuesto: number): Promise<void> {
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(transaction, "EXECUTE PROCEDURE SP_ELIMINAR_PRESUPUESTO(?)", [id_presupuesto]);
            await transaction.commit();
        } catch (err) {
            throw new Error("Error deleting presupuesto: " + err);
        }
    }
}