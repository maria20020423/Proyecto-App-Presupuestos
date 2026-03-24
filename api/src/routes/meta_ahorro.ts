import { Router } from 'express';
import MetaAhorroService from '../service/meta_ahorro.service.js';
import type { CreateMetaAhorroDto } from '../types/dto/meta_ahorro/create_meta_ahorro.js';
import type { UpdateMetaAhorroDto } from '../types/dto/meta_ahorro/update_meta_ahorro.js';

export default (metaAhorroService: MetaAhorroService): Router => {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const id_usuario = req.query.id_usuario ? Number(req.query.id_usuario) : undefined;
      const results = await metaAhorroService.getMetas(id_usuario);
      return res.status(200).json({ message: 'Fetching metas de ahorro', results });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching metas de ahorro', error: `${error}` });
    }
  });

  router.get('/:id_meta_ahorro', async (req, res) => {
    try {
      const id_meta_ahorro = parseInt(req.params.id_meta_ahorro, 10);
      const id_usuario = req.query.id_usuario ? Number(req.query.id_usuario) : undefined;
      const result = await metaAhorroService.getMetaById(id_meta_ahorro, id_usuario);
      if (!result) {
        return res.status(404).json({ message: 'Meta de ahorro not found' });
      }
      return res.status(200).json({ message: 'Meta de ahorro encontrada', results: result });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching meta de ahorro', error: `${error}` });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const meta = req.body as CreateMetaAhorroDto;
      const id = await metaAhorroService.createMeta(meta);
      return res.status(201).json({ message: 'Meta de ahorro creada correctamente', id });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating meta de ahorro', error: `${error}` });
    }
  });

  router.put('/:id_meta_ahorro', async (req, res) => {
    try {
      const id_meta_ahorro = parseInt(req.params.id_meta_ahorro, 10);
      const meta = req.body as UpdateMetaAhorroDto;
      await metaAhorroService.updateMeta(id_meta_ahorro, meta);
      return res.status(200).json({ message: 'Meta de ahorro actualizada correctamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating meta de ahorro', error: `${error}` });
    }
  });

  router.delete('/:id_meta_ahorro', async (req, res) => {
    try {
      const id_meta_ahorro = parseInt(req.params.id_meta_ahorro, 10);
      await metaAhorroService.deleteMeta(id_meta_ahorro);
      return res.status(200).json({ message: 'Meta de ahorro eliminada correctamente' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting meta de ahorro', error: `${error}` });
    }
  });

  return router;
};
