import { Router } from 'express';
import DetallePresupuestoService from '../service/detalle_presupuesto.service.js';

export default (detallePresupuestoService: DetallePresupuestoService): Router => {
    const router = Router();

    router.get('/presupuesto/:id_presupuesto', async (req, res) => {
        const id_presupuesto = Number(req.params.id_presupuesto);
        if (Number.isNaN(id_presupuesto)) {
            return res.status(400).json({ message: 'id_presupuesto invalido' });
        }
        try {
            const detalles = await detallePresupuestoService.listByPresupuesto(id_presupuesto);
            return res.status(200).json({ message: 'Detalles de presupuesto obtenidos', results: detalles });
        } catch (err) {
            return res.status(500).json({ message: 'Error listando detalles de presupuesto', error: `${err}` });
        }
    });

    router.get('/:id_detalle', async (req, res) => {
        const id_detalle = Number(req.params.id_detalle);
        if (Number.isNaN(id_detalle)) {
            return res.status(400).json({ message: 'id_detalle invalido' });
        }
        try {
            const detalle = await detallePresupuestoService.getById(id_detalle);
            if (!detalle) {
                return res.status(404).json({ message: 'Detalle de presupuesto no encontrado' });
            }
            return res.status(200).json({ message: 'Detalle de presupuesto obtenido', results: detalle });
        } catch (err) {
            return res.status(500).json({ message: 'Error obteniendo detalle de presupuesto', error: `${err}` });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const id_detalle = await detallePresupuestoService.create(req.body);
            return res.status(201).json({ message: 'Detalle de presupuesto creado', id_detalle });
        } catch (err) {
            return res.status(500).json({ message: 'Error creando detalle de presupuesto', error: `${err}` });
        }
    });

    router.put('/:id_detalle', async (req, res) => {
        const id_detalle = Number(req.params.id_detalle);
        if (Number.isNaN(id_detalle)) {
            return res.status(400).json({ message: 'id_detalle invalido' });
        }
        try {
            await detallePresupuestoService.update(id_detalle, req.body);
            return res.status(200).json({ message: 'Detalle de presupuesto actualizado' });
        } catch (err) {
            return res.status(500).json({ message: 'Error actualizando detalle de presupuesto', error: `${err}` });
        }
    });

    router.delete('/:id_detalle', async (req, res) => {
        const id_detalle = Number(req.params.id_detalle);
        const modificado_por = Number(req.query.modificado_por ?? req.body?.modificado_por);
        if (Number.isNaN(id_detalle)) {
            return res.status(400).json({ message: 'id_detalle invalido' });
        }
        if (Number.isNaN(modificado_por)) {
            return res.status(400).json({ message: 'modificado_por es requerido' });
        }
        try {
            await detallePresupuestoService.delete(id_detalle, modificado_por);
            return res.status(200).json({ message: 'Detalle de presupuesto eliminado' });
        } catch (err) {
            return res.status(500).json({ message: 'Error eliminando detalle de presupuesto', error: `${err}` });
        }
    });

    return router;
};
