import {Router} from 'express';
import PresupuestoService from '../service/presupuesto.service.js';


export default (presupuestoService:PresupuestoService): Router => {


    

  const router = Router();

  router.get('/all', async (req, res) => {
    const id_usuario = parseInt(req.query.id_usuario as string);
    const estado = req.query.estado as string;
    const result = await presupuestoService.getPresupuestos(id_usuario, estado);
    return res.status(200).json({ message: "Fetching presupuestos", results: result });
  });

  router.post('/create', async (req, res) => {
    const presupuesto = req.body;
    try {
      await presupuestoService.createPresupuesto(presupuesto);

      return res.status(201).json({ message: "Presupuesto created successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error creating presupuesto", error: err });
    }
  })

  router.get('/:id_presupuesto', async (req, res) => {
    const id_presupuesto = parseInt(req.params.id_presupuesto);
    try {
      const result = await presupuestoService.getPresupuestoById(id_presupuesto);
      return res.status(200).json({ message: "Fetching presupuesto", results: result });
    } catch (err) {
      return res.status(500).json({ message: "Error fetching presupuesto", error: err });
    }
  });

  router.delete('/:id_presupuesto', async (req, res) => {
    const id_presupuesto = parseInt(req.params.id_presupuesto);
    try {
      await presupuestoService.deletePresupuesto(id_presupuesto);
      return res.status(200).json({ message: "Presupuesto deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error deleting presupuesto", error: err });
    }
  });

  router.put('/:id_presupuesto', async (req, res) => {
    const id_presupuesto = parseInt(req.params.id_presupuesto);
    const presupuesto = req.body;
    try {
      await presupuestoService.updatePresupuesto(id_presupuesto, presupuesto);
      return res.status(200).json({ message: "Presupuesto updated successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error updating presupuesto", error: err });
    }
  });

  return router;
};




















