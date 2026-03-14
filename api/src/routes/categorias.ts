import { Router } from 'express';
import CategoriaService from '../service/categoria.service.js';

export default (categoriaService: CategoriaService): Router => {
    const router = Router();

    router.get('/', async (req, res) => {
        const id_usuario = Number(req.query.id_usuario);
        const tipo_categoria = req.query.tipo_categoria as string | undefined;
        if (Number.isNaN(id_usuario)) {
            return res.status(400).json({ message: 'id_usuario es requerido' });
        }
        try {
            const categorias = await categoriaService.listCategorias(id_usuario, tipo_categoria);
            return res.status(200).json({ message: 'Categorias fetched', results: categorias });
        } catch (err) {
            return res.status(500).json({ message: 'Error fetching categorias', error: `${err}` });
        }
    });

    router.get('/:id_categoria', async (req, res) => {
        const id_categoria = Number(req.params.id_categoria);
        if (Number.isNaN(id_categoria)) {
            return res.status(400).json({ message: 'id_categoria invalido' });
        }
        try {
            const categoria = await categoriaService.getCategoriaById(id_categoria);
            if (!categoria) {
                return res.status(404).json({ message: 'Categoria no encontrada' });
            }
            return res.status(200).json({ message: 'Categoria fetched', results: categoria });
        } catch (err) {
            return res.status(500).json({ message: 'Error fetching categoria', error: `${err}` });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const id_categoria = await categoriaService.createCategoria(req.body);
            return res.status(201).json({ message: 'Categoria creada', id_categoria });
        } catch (err) {
            return res.status(500).json({ message: 'Error creando categoria', error: `${err}` });
        }
    });

    router.put('/:id_categoria', async (req, res) => {
        const id_categoria = Number(req.params.id_categoria);
        if (Number.isNaN(id_categoria)) {
            return res.status(400).json({ message: 'id_categoria invalido' });
        }
        try {
            await categoriaService.updateCategoria(id_categoria, req.body);
            return res.status(200).json({ message: 'Categoria actualizada' });
        } catch (err) {
            return res.status(500).json({ message: 'Error actualizando categoria', error: `${err}` });
        }
    });

    router.delete('/:id_categoria', async (req, res) => {
        const id_categoria = Number(req.params.id_categoria);
        if (Number.isNaN(id_categoria)) {
            return res.status(400).json({ message: 'id_categoria invalido' });
        }
        try {
            await categoriaService.deleteCategoria(id_categoria);
            return res.status(200).json({ message: 'Categoria eliminada' });
        } catch (err) {
            return res.status(500).json({ message: 'Error eliminando categoria', error: `${err}` });
        }
    });

    return router;
};
