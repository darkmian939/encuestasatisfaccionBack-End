// routes/aprendiz_routes.js
const express = require('express');
const router = express.Router();
const {
    createAprendiz,
    listAprendices,
    deleteAprendiz,
    updateAprendiz,
    searchAprendizByDocumento
} = require('../controllers/aprendiz_controller');

// Ruta para crear un aprendiz
router.post('/', async (req, res) => {
    try {
        const aprendiz = await createAprendiz(req.body);
        res.status(201).json(aprendiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ruta para listar todos los aprendices
router.get('/', async (req, res) => {
    try {
        const aprendices = await listAprendices();
        res.json(aprendices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para eliminar un aprendiz
router.delete('/:id', async (req, res) => {
    try {
        await deleteAprendiz(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Ruta para actualizar un aprendiz
router.put('/:id', async (req, res) => {
    try {
        const aprendiz = await updateAprendiz(req.params.id, req.body);
        res.json(aprendiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ruta para buscar un aprendiz por documento
router.get('/search', async (req, res) => {
    try {
        const aprendiz = await searchAprendizByDocumento(req.query.documento);
        if (!aprendiz) return res.status(404).json({ message: "Aprendiz no encontrado" });
        res.json(aprendiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
