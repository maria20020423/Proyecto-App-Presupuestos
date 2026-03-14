import { Router } from 'express';
import SubcategoriaService from '../service/subcategoria.service.js';

export default (subcategoriaService: SubcategoriaService): Router => {
    const router = Router();

    router.get('/categoria/:id_categoria', async (req, res) => {
        const id_categoria = Number(req.params.id_categoria);
        if (Number.isNaN(id_categoria)) {
            return res.status(400).json({ message: 'id_categoria invalido' });
        }
        try {
            const subcategorias = await subcategoriaService.listByCategoria(id_categoria);
            return res.status(200).json({ message: 'Subcategorias fetched', results: subcategorias });
        } catch (err) {
            return res.status(500).json({ message: 'Error fetching subcategorias', error: `${err}` });
        }
    });

    router.get('/:id_subcategoria', async (req, res) => {
        const id_subcategoria = Number(req.params.id_subcategoria);
        if (Number.isNaN(id_subcategoria)) {
            return res.status(400).json({ message: 'id_subcategoria invalido' });
        }
        try {
            const subcategoria = await subcategoriaService.getById(id_subcategoria);
            if (!subcategoria) {
                return res.status(404).json({ message: 'Subcategoria no encontrada' });
            }
            return res.status(200).json({ message: 'Subcategoria fetched', results: subcategoria });
        } catch (err) {
            return res.status(500).json({ message: 'Error fetching subcategoria', error: `${err}` });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const id_subcategoria = await subcategoriaService.create(req.body);
            return res.status(201).json({ message: 'Subcategoria creada', id_subcategoria });
        } catch (err) {
            return res.status(500).json({ message: 'Error creando subcategoria', error: `${err}` });
        }
    });

    router.put('/:id_subcategoria', async (req, res) => {
        const id_subcategoria = Number(req.params.id_subcategoria);
        if (Number.isNaN(id_subcategoria)) {
            return res.status(400).json({ message: 'id_subcategoria invalido' });
        }
        try {
            await subcategoriaService.update(id_subcategoria, req.body);
            return res.status(200).json({ message: 'Subcategoria actualizada' });
        } catch (err) {
            return res.status(500).json({ message: 'Error actualizando subcategoria', error: `${err}` });
        }
    });

    router.delete('/:id_subcategoria', async (req, res) => {
        const id_subcategoria = Number(req.params.id_subcategoria);
        if (Number.isNaN(id_subcategoria)) {
            return res.status(400).json({ message: 'id_subcategoria invalido' });
        }
        try {
            await subcategoriaService.delete(id_subcategoria);
            return res.status(200).json({ message: 'Subcategoria eliminada' });
        } catch (err) {
            return res.status(500).json({ message: 'Error eliminando subcategoria', error: `${err}` });
        }
    });

    return router;
};
