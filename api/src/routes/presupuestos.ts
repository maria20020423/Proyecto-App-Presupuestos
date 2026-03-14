import { Router } from 'express';
import PresupuestoService from '../service/presupuesto.service.js';

export default (presupuestoService: PresupuestoService): Router => {
  const router = Router();

  router.get('/', async (req, res) => {
    const id_usuario = Number(req.query.id_usuario);
    const estado = req.query.estado as string | undefined;
    if (Number.isNaN(id_usuario)) {
      return res.status(400).json({ message: 'id_usuario es requerido' });
    }
    try {
      const result = await presupuestoService.getPresupuestos(id_usuario, estado);
      return res.status(200).json({ message: 'Presupuestos fetched', results: result });
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching presupuestos', error: `${err}` });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const id_presupuesto = await presupuestoService.createPresupuesto(req.body);
      return res.status(201).json({ message: 'Presupuesto creado', id_presupuesto });
    } catch (err) {
      return res.status(500).json({ message: 'Error creando presupuesto', error: `${err}` });
    }
  });

  router.get('/:id_presupuesto', async (req, res) => {
    const id_presupuesto = Number(req.params.id_presupuesto);
    if (Number.isNaN(id_presupuesto)) {
      return res.status(400).json({ message: 'id_presupuesto invalido' });
    }
    try {
      const result = await presupuestoService.getPresupuestoById(id_presupuesto);
      return res.status(200).json({ message: 'Presupuesto fetched', results: result });
    } catch (err) {
      return res.status(500).json({ message: 'Error fetching presupuesto', error: `${err}` });
    }
  });

  router.put('/:id_presupuesto', async (req, res) => {
    const id_presupuesto = Number(req.params.id_presupuesto);
    if (Number.isNaN(id_presupuesto)) {
      return res.status(400).json({ message: 'id_presupuesto invalido' });
    }
    try {
      await presupuestoService.updatePresupuesto(id_presupuesto, req.body);
      return res.status(200).json({ message: 'Presupuesto actualizado' });
    } catch (err) {
      return res.status(500).json({ message: 'Error actualizando presupuesto', error: `${err}` });
    }
  });

  router.delete('/:id_presupuesto', async (req, res) => {
    const id_presupuesto = Number(req.params.id_presupuesto);
    if (Number.isNaN(id_presupuesto)) {
      return res.status(400).json({ message: 'id_presupuesto invalido' });
    }
    try {
      await presupuestoService.deletePresupuesto(id_presupuesto);
      return res.status(200).json({ message: 'Presupuesto eliminado' });
    } catch (err) {
      return res.status(500).json({ message: 'Error eliminando presupuesto', error: `${err}` });
    }
  });

  return router;
};



















