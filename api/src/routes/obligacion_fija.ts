import { Router } from 'express';
import ObligacionFijaService from '../service/obligacion_fija.service.js';

export default (obligacionFijaService: ObligacionFijaService): Router => {
  const router = Router();

  // GET all with optional filters
  router.get('/', async (req, res) => {
    const id_usuario = req.query.id_usuario ? parseInt(req.query.id_usuario as string) : null;
    const is_vigente = req.query.is_vigente ? req.query.is_vigente === 'true' : true;
    
    try {
      const result = await obligacionFijaService.getObligaciones(id_usuario,is_vigente);
      return res.status(200).json({ message: "Fetching obligaciones fijas", results: result });
    } catch (err) {
      return res.status(500).json({ message: "Error fetching obligaciones fijas", error: err });
    }
  });

  // GET by ID
  router.get('/:id_obligacion', async (req, res) => {
    try {
      const id_obligacion = parseInt(req.params.id_obligacion);
      const result = await obligacionFijaService.getObligacionById(id_obligacion);
      if (!result) {
        return res.status(404).json({ message: "Obligacion fija not found" });
      }
      return res.status(200).json({ message: "Fetching obligacion fija", results: result });
    } catch (err) {
      return res.status(500).json({ message: "Error fetching obligacion fija", error: err });
    }
  });

  // POST create
  router.post('/', async (req, res) => {
    try {
      const obligacion = req.body;
      const id = await obligacionFijaService.createObligacion(obligacion);
      return res.status(201).json({ message: "Obligacion fija created successfully", id });
    } catch (err) {
      return res.status(500).json({ message: "Error creating obligacion fija", error: err });
    }
  });

  // PUT update
  router.put('/:id_obligacion', async (req, res) => {
    try {
      const id_obligacion = parseInt(req.params.id_obligacion);
      const obligacion = req.body;
      await obligacionFijaService.updateObligacion(id_obligacion, obligacion);
      return res.status(200).json({ message: "Obligacion fija updated successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error updating obligacion fija", error: err });
    }
  });

  // DELETE (soft delete)
  router.delete('/:id_obligacion', async (req, res) => {
    const id_obligacion = parseInt(req.params.id_obligacion);
    
    try {
      await obligacionFijaService.deleteObligacion(id_obligacion);
      return res.status(200).json({ message: "Obligacion fija deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Error deleting obligacion fija", error: err });
    }
  });

  return router;
};
