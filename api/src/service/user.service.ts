
import { type Request, type RequestHandler, type Response } from "express";
import type { Attachment } from 'node-firebird-driver-native';
import type { GetUsuarioResult } from "../types/dto/usuario/get_usuario_result.js";
import type { LoginDto } from "../types/dto/auth/login.dto.js";
import type { LoginResultDto } from "../types/dto/auth/login_result.dto.js";

export default class UserService {
    private firebird_client: Attachment;
    ////

    constructor(firebird_client: Attachment) {
        this.firebird_client = firebird_client;
    }
    public getUsers: RequestHandler = async (_req: Request, res: Response) => {
        const transaction = await this.firebird_client.startTransaction();
        const query = "SELECT * FROM SP_LISTAR_USUARIOS;";
        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                query
            );

            const rows = await resultSet.fetchAsObject<GetUsuarioResult>();
            await resultSet.close();
            await transaction.commit();

            return res.json({ message: "getUsers", users: rows });
        } catch (err) {
            await transaction.rollback();
            return res.status(500).json({ message: "Error fetching users", error: err });
        }


    };

    public getUser: RequestHandler = async (_req: Request, res: Response) => {
        const id_usuario = _req.params.id_usuario;
        const transaction = await this.firebird_client.startTransaction();
        const query = "SELECT * FROM SP_CONSULTAR_USUARIO(?);";

        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                query,
                [id_usuario]
            );
   
            const rows = await resultSet.fetchAsObject<GetUsuarioResult>();
            await resultSet.close();
            await transaction.commit();
            return res.json({ message: "getUser", results: rows });
        } catch (err) {
            await transaction.rollback();
            return res.status(500).json({ message: "Error fetching user", error: err });
        }


    };

    public createUser: RequestHandler = async (_req: Request, res: Response) => {
        const { nombre, apellido, email, salario_mensual } = _req.body;
        const transaction = await this.firebird_client.startTransaction();
        try {
            await this.firebird_client.execute(
                transaction,
                'EXECUTE PROCEDURE SP_INSERTAR_USUARIO(?,?,?,?);',
                [nombre, apellido, email, salario_mensual]
            );
            await transaction.commit();
            return res.json({ message: "User created successfully" });
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating user:', error);
            return res.status(500).json({ message: "Error creating user", error: error });
        }



    };

    public loginUser: RequestHandler = async (req: Request<unknown, unknown, LoginDto>, res: Response) => {
        const { correo } = req.body;
        const transaction = await this.firebird_client.startTransaction();
        const query = "SELECT * FROM SP_LOGIN_USUARIO(?);";

        try {
            const resultSet = await this.firebird_client.executeQuery(
                transaction,
                query,
                [correo]
            );

            const rows = await resultSet.fetchAsObject<LoginResultDto>();
            await resultSet.close();
            await transaction.commit();

            if (!rows.length) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }

            return res.json({ message: "login", usuario: rows[0] });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: "Error during login", error });
        }
    };
}
