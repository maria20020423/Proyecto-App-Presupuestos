import express from 'express'
import type { Request, Response } from 'express';
import type { CorsOptions } from "cors";
import cors from 'cors'
import {createNativeClient,getDefaultLibraryFilename} from 'node-firebird-driver-native';
import UserService from './service/user.service.js';
import userRouter from './routes/usuarios.js';
import presupuestoRouter from './routes/presupuestos.js';
import PresupuestoService from './service/presupuesto.service.js';
const app = express();
const PORT = 3000;


const corsOptions: CorsOptions = {
  origin: "http://localhost:8081"
};
app.use(express.json());

const client=createNativeClient(getDefaultLibraryFilename());
    // Connection options
  const options = {
    username: 'maria', // Default username
    password: 'mariita', // Default password
    sessionTimeZone: 'UTC' // Set session time zone to UTC
  };

const attachment =await client.connect("localhost/3050:/var/lib/firebird/data/mirror.fdb",options)

const userService = new UserService(attachment);
const presupuestoService = new PresupuestoService(attachment);


app.use(cors(corsOptions));
app.use('/usuarios', userRouter(userService));
app.use('/presupuesto',presupuestoRouter(presupuestoService));

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'TypeScript API is humming along!' });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});