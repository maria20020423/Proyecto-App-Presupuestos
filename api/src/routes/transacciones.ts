import { Router } from 'express';
import TransaccionesService from '../service/transacciones.service.js';

export default (transaccionesService: TransaccionesService): Router => {
  const router = Router();

  // GET all with optional filters
  router.get('/', async (req, res) => {
    const id_presupuesto = req.query.id_presupuesto ? parseInt(req.query.id_presupuesto as string) : null;
    const anio = req.query.anio ? parseInt(req.query.anio as string) : null;
    const mes = req.query.mes ? parseInt(req.query.mes as string) : null;
    const tipo = req.query.tipo ? (req.query.tipo as string) : null;

    if (!id_presupuesto) {
      return res.status(400).json({ message: "id_presupuesto is required" });
    }
    
    try {
      const result = await transaccionesService.getTransacciones(id_presupuesto, anio, mes, tipo);
      return res.status(200).json({ message: "Fetching transacciones", results: result });
    } catch (err) {
      return res.status(500).json({ message: "Error fetching transacciones", error: err });
    }
  });

  // GET by ID
  router.get('/:id_transacciones', async (req, res) => {
    const id_transacciones = parseInt(req.params.id_transacciones);
    try {
      const result = await transaccionesService.getTransaccionById(id_transacciones);
      return res.status(200).json({ message: "Fetching transaccion", results: result });
    } catch (err) {
      return res.status(500).json({ message: "Error fetching transaccion", error: err });
    }
  });

  // POST create
  router.post('/', async (req, res) => {
    const transaccion = req.body;
    try {
      const result = await transaccionesService.createTransaccion(transaccion);
      return res.status(201).json({ 
        message: "Transaccion created successfully", 
        id_transacciones: result 
      });
    } catch (err) {
      return res.status(500).json({ message: "Error creating transaccion", error: err });
    }
  });

  // PUT update
  router.put('/:id_transacciones', async (req, res) => {
    const id_transacciones = parseInt(req.params.id_transacciones);
    const transaccion = req.body;
    try {
      await transaccionesService.updateTransaccion(id_transacciones, transaccion);
      return res.status(200).json({ message: "Transaccion updated successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error updating transaccion", error: err });
    }
  });

  // DELETE (soft delete)
  router.delete('/:id_transacciones', async (req, res) => {
    const id_transacciones = parseInt(req.params.id_transacciones);
    const { modificado_por } = req.body;
    
    if (!modificado_por) {
      return res.status(400).json({ message: "modificado_por is required for deletion" });
    }
    
    try {
      await transaccionesService.deleteTransaccion(id_transacciones, modificado_por);
      return res.status(200).json({ message: "Transaccion deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error deleting transaccion", error: err });
    }
  });

  return router;
};
