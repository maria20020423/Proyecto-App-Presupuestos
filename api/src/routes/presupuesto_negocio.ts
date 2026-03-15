import { Router } from 'express';
import PresupuestoNegocioService from '../service/presupuesto_negocio.service.js';

export default (presupuestoNegocioService: PresupuestoNegocioService): Router => {
    const router = Router();

    /**
     * POST /negocio/presupuesto/crear-completo
     * Crea un presupuesto con todas las validaciones de negocio
     * (vigencia, solapamiento).
     * Body: CrearPresupuestoCompletoDto
     */
    router.post('/presupuesto/crear-completo', async (req, res) => {
        try {
            const result = await presupuestoNegocioService.crearPresupuestoCompleto(req.body);
            return res.status(201).json({ message: 'Presupuesto creado correctamente', results: result });
        } catch (err) {
            return res.status(500).json({ message: 'Error al crear presupuesto', error: `${err}` });
        }
    });

    /**
     * POST /negocio/transacciones/registrar
     * Registra una transacción con todas las validaciones de negocio
     * (vigencia del presupuesto, tipo de categoría, obligación opcional).
     * Body: RegistrarTransaccionCompletaDto
     */
    router.post('/transacciones/registrar', async (req, res) => {
        try {
            const result = await presupuestoNegocioService.registrarTransaccionCompleta(req.body);
            return res.status(201).json({ message: 'Transacción registrada correctamente', results: result });
        } catch (err) {
            return res.status(500).json({ message: 'Error al registrar transacción', error: `${err}` });
        }
    });

    /**
     * GET /negocio/obligaciones/procesar-mes
     * Devuelve las obligaciones activas del usuario para el mes/año dado
     * con su nivel de alerta.
     * Query params: id_usuario, id_presupuesto, anio, mes
     */
    router.get('/obligaciones/procesar-mes', async (req, res) => {
        const id_usuario = Number(req.query.id_usuario);
        const id_presupuesto = Number(req.query.id_presupuesto);
        const anio = Number(req.query.anio);
        const mes = Number(req.query.mes);

        if (Number.isNaN(id_usuario) || Number.isNaN(id_presupuesto) || Number.isNaN(anio) || Number.isNaN(mes)) {
            return res.status(400).json({ message: 'Parámetros inválidos: id_usuario, id_presupuesto, anio y mes son requeridos' });
        }

        try {
            const result = await presupuestoNegocioService.procesarObligacionesMes(id_usuario, anio, mes, id_presupuesto);
            return res.status(200).json({ message: 'Obligaciones del mes procesadas', results: result });
        } catch (err) {
            return res.status(500).json({ message: 'Error al procesar obligaciones del mes', error: `${err}` });
        }
    });

    /**
     * GET /negocio/presupuesto/:id_presupuesto/balance-mensual
     * Calcula el balance financiero del mes: ingresos, gastos, ahorros y balance final.
     * Query params: id_usuario, anio, mes
     */
    router.get('/presupuesto/:id_presupuesto/balance-mensual', async (req, res) => {
        const id_presupuesto = Number(req.params.id_presupuesto);
        const id_usuario = Number(req.query.id_usuario);
        const anio = Number(req.query.anio);
        const mes = Number(req.query.mes);

        if (Number.isNaN(id_presupuesto) || Number.isNaN(id_usuario) || Number.isNaN(anio) || Number.isNaN(mes)) {
            return res.status(400).json({ message: 'Parámetros inválidos: id_presupuesto, id_usuario, anio y mes son requeridos' });
        }

        try {
            const result = await presupuestoNegocioService.calcularBalanceMensual(id_usuario, id_presupuesto, anio, mes);
            return res.status(200).json({ message: 'Balance mensual calculado', results: result });
        } catch (err) {
            return res.status(500).json({ message: 'Error al calcular balance mensual', error: `${err}` });
        }
    });

    /**
     * GET /negocio/presupuesto/:id_presupuesto/monto-ejecutado
     * Suma las transacciones de una subcategoría para un mes específico.
     * Query params: id_subcategoria, anio, mes
     */
    router.get('/presupuesto/:id_presupuesto/monto-ejecutado', async (req, res) => {
        const id_presupuesto = Number(req.params.id_presupuesto);
        const id_subcategoria = Number(req.query.id_subcategoria);
        const anio = Number(req.query.anio);
        const mes = Number(req.query.mes);

        if (Number.isNaN(id_presupuesto) || Number.isNaN(id_subcategoria) || Number.isNaN(anio) || Number.isNaN(mes)) {
            return res.status(400).json({ message: 'Parámetros inválidos: id_presupuesto, id_subcategoria, anio y mes son requeridos' });
        }

        try {
            const result = await presupuestoNegocioService.calcularMontoEjecutadoMes(id_subcategoria, id_presupuesto, anio, mes);
            return res.status(200).json({ message: 'Monto ejecutado calculado', results: result });
        } catch (err) {
            return res.status(500).json({ message: 'Error al calcular monto ejecutado', error: `${err}` });
        }
    });

    /**
     * GET /negocio/presupuesto/:id_presupuesto/porcentaje-ejecucion
     * Calcula el porcentaje ejecutado de una subcategoría para un mes específico.
     * Query params: id_subcategoria, anio, mes
     */
    router.get('/presupuesto/:id_presupuesto/porcentaje-ejecucion', async (req, res) => {
        const id_presupuesto = Number(req.params.id_presupuesto);
        const id_subcategoria = Number(req.query.id_subcategoria);
        const anio = Number(req.query.anio);
        const mes = Number(req.query.mes);

        if (Number.isNaN(id_presupuesto) || Number.isNaN(id_subcategoria) || Number.isNaN(anio) || Number.isNaN(mes)) {
            return res.status(400).json({ message: 'Parámetros inválidos: id_presupuesto, id_subcategoria, anio y mes son requeridos' });
        }

        try {
            const result = await presupuestoNegocioService.calcularPorcentajeEjecucionMes(id_subcategoria, id_presupuesto, anio, mes);
            return res.status(200).json({ message: 'Porcentaje de ejecución calculado', results: result });
        } catch (err) {
            return res.status(500).json({ message: 'Error al calcular porcentaje de ejecución', error: `${err}` });
        }
    });

    /**
     * PATCH /negocio/presupuesto/:id_presupuesto/cerrar
     * Cierra un presupuesto (valida que la fecha de fin haya pasado)
     * y retorna el resumen final de ejecución.
     * Body: CerrarPresupuestoDto { modificado_por }
     */
    router.patch('/presupuesto/:id_presupuesto/cerrar', async (req, res) => {
        const id_presupuesto = Number(req.params.id_presupuesto);

        if (Number.isNaN(id_presupuesto)) {
            return res.status(400).json({ message: 'id_presupuesto inválido' });
        }

        try {
            const result = await presupuestoNegocioService.cerrarPresupuesto(id_presupuesto, req.body);
            return res.status(200).json({ message: 'Presupuesto cerrado correctamente', results: result });
        } catch (err) {
            return res.status(500).json({ message: 'Error al cerrar presupuesto', error: `${err}` });
        }
    });

    /**
     * GET /negocio/presupuesto/:id_presupuesto/resumen-categoria
     * Calcula el resumen mensual de una categoría (presupuestado, ejecutado, porcentaje).
     * Query params: id_categoria, anio, mes
     */
    router.get('/presupuesto/:id_presupuesto/resumen-categoria', async (req, res) => {
        const id_presupuesto = Number(req.params.id_presupuesto);
        const id_categoria = Number(req.query.id_categoria);
        const anio = Number(req.query.anio);
        const mes = Number(req.query.mes);

        if (Number.isNaN(id_presupuesto) || Number.isNaN(id_categoria) || Number.isNaN(anio) || Number.isNaN(mes)) {
            return res.status(400).json({ message: 'Parámetros inválidos: id_presupuesto, id_categoria, anio y mes son requeridos' });
        }

        try {
            const result = await presupuestoNegocioService.obtenerResumenCategoriaMes(id_categoria, id_presupuesto, anio, mes);
            return res.status(200).json({ message: 'Resumen de categoría obtenido', results: result });
        } catch (err) {
            return res.status(500).json({ message: 'Error al obtener resumen de categoría', error: `${err}` });
        }
    });

    return router;
};
