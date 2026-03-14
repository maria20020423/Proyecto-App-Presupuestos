import express from 'express'
import type { Request, Response } from 'express';
import type { CorsOptions } from "cors";
import cors from 'cors'
import {createNativeClient,getDefaultLibraryFilename} from 'node-firebird-driver-native';
import UserService from './service/user.service.js';
import userRouter from './routes/usuarios.js';
import presupuestoRouter from './routes/presupuestos.js';
import PresupuestoService from './service/presupuesto.service.js';
import CategoriaService from './service/categoria.service.js';
import categoriaRouter from './routes/categorias.js';
import SubcategoriaService from './service/subcategoria.service.js';
import subcategoriaRouter from './routes/subcategorias.js';
import { lowercaseResponseMiddleware } from './middleware/lowercaseResponse.js';
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
    sessionTimeZone: 'UTC', // Set session time zone to UT
    lowerCaseKeys: true,
    
  };

const attachment =await client.connect("localhost/3050:/var/lib/firebird/data/mirror.fdb",options)
//caudno se corre local usar:


const userService = new UserService(attachment);
const presupuestoService = new PresupuestoService(attachment);
const categoriaService = new CategoriaService(attachment);
const subcategoriaService = new SubcategoriaService(attachment);


app.use(cors(corsOptions));
app.use(lowercaseResponseMiddleware);
app.use('/usuarios', userRouter(userService));
app.use('/presupuesto',presupuestoRouter(presupuestoService));
app.use('/categorias', categoriaRouter(categoriaService));
app.use('/subcategorias', subcategoriaRouter(subcategoriaService));

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'TypeScript API is humming along!' });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
