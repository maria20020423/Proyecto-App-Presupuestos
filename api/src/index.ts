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
import PresupuestoNegocioService from './service/presupuesto_negocio.service.js';
import presupuestoNegocioRouter from './routes/presupuesto_negocio.js';
import DetallePresupuestoService from './service/detalle_presupuesto.service.js';
import detallePresupuestoRouter from './routes/detalle_presupuesto.js';
import TransaccionesService from './service/transacciones.service.js';
import transaccionesRouter from './routes/transacciones.js';
import ObligacionFijaService from './service/obligacion_fija.service.js';
import obligacionFijaRouter from './routes/obligacion_fija.js';
import MetaAhorroService from './service/meta_ahorro.service.js';
import metaAhorroRouter from './routes/meta_ahorro.js';
import { lowercaseResponseMiddleware } from './middleware/lowercaseResponse.js';
const app = express();
const PORT = 3000;


const corsOptions: CorsOptions = {
  origin: "http://localhost:3001"
};
app.disable('etag');
app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
app.use(express.json());

const client=createNativeClient(getDefaultLibraryFilename());
    // Connection options
  const options = {
    username: 'SYSDBA', // Default username
    password: 'maria', // Default password
    sessionTimeZone: 'UTC', // Set session time zone to UT
    lowerCaseKeys: true,
    
  };

const attachment =await client.connect("localhost/3050:/var/lib/firebird/data/mirror.fdb",options)
//caudno se corre local usar:


const userService = new UserService(attachment);
const presupuestoService = new PresupuestoService(attachment);
const categoriaService = new CategoriaService(attachment);
const subcategoriaService = new SubcategoriaService(attachment);
const presupuestoNegocioService = new PresupuestoNegocioService(attachment);
const detallePresupuestoService = new DetallePresupuestoService(attachment);
const transaccionesService = new TransaccionesService(attachment);
const obligacionFijaService = new ObligacionFijaService(attachment);
const metaAhorroService = new MetaAhorroService(attachment);


app.use(cors(corsOptions));
app.use(lowercaseResponseMiddleware);
app.use('/usuarios', userRouter(userService));
app.use('/presupuesto',presupuestoRouter(presupuestoService));
app.use('/categorias', categoriaRouter(categoriaService));
app.use('/subcategorias', subcategoriaRouter(subcategoriaService));
app.use('/negocio', presupuestoNegocioRouter(presupuestoNegocioService));
app.use('/detalle-presupuesto', detallePresupuestoRouter(detallePresupuestoService));
app.use('/transacciones', transaccionesRouter(transaccionesService));
app.use('/obligacion-fija', obligacionFijaRouter(obligacionFijaService));
app.use('/meta-ahorro', metaAhorroRouter(metaAhorroService));

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'TypeScript API is humming along!' });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
