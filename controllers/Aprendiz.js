// controllers/aprendiz_controller.js
const Aprendiz = require('../models/Aprendiz_model');
const Joi = require('@hapi/joi');

// Definimos el esquema de validación para los datos de aprendiz
const schema = Joi.object({
    ficha: Joi.string().required(),
    nombre: Joi.string().required(),
    jornada: Joi.string().required(),
    documento: Joi.string().required(),
    apellidos: Joi.string().required(),
    celular: Joi.string().required(),
    correo: Joi.string().email().required(),
    // Añadir validaciones para campos adicionales si es necesario
});



// Función para crear un aprendiz
async function createAprendiz(body) {
    try {
        // Validamos los datos usando Joi
        const value = await schema.validateAsync(body);
        const aprendiz = new Aprendiz(value);
        return await aprendiz.save(); // Guardamos en la base de datos
    } catch (error) {
        throw new Error("Error al crear el aprendiz: " + error.message);
    }
}

// Función para listar todos los aprendices
async function listAprendices() {
    try {
        return await Aprendiz.find(); // Devuelve todos los aprendices
    } catch (error) {
        throw new Error("Error al listar aprendices: " + error.message);
    }
}

// Función para eliminar un aprendiz por ID
async function deleteAprendiz(id) {
    try {
        return await Aprendiz.findByIdAndDelete(id); // Elimina el aprendiz por su ID
    } catch (error) {
        throw new Error("Error al eliminar el aprendiz: " + error.message);
    }
}

// Función para actualizar un aprendiz por ID
async function updateAprendiz(id, data) {
    try {
        const aprendiz = await Aprendiz.findById(id);
        if (!aprendiz) {
            throw new Error("Aprendiz no encontrado");
        }
        // Actualizar solo los campos enviados en la petición
        if (data.nombre) aprendiz.nombre = data.nombre;
        if (data.apellidos) aprendiz.apellidos = data.apellidos;
        if (data.celular) aprendiz.celular = data.celular;
        if (data.correo) aprendiz.correo = data.correo;
        // Agrega otras actualizaciones según los campos de tu modelo

        return await aprendiz.save(); // Guardamos los cambios en la base de datos
    } catch (error) {
        throw new Error("Error al actualizar el aprendiz: " + error.message);
    }
}

// Función para buscar un aprendiz por su número de documento
async function searchAprendizByDocumento(documento) {
    try {
        return await Aprendiz.findOne({ documento });
    } catch (error) {
        throw new Error("Error al buscar el aprendiz por documento: " + error.message);
    }
}

// Exportamos las funciones para usarlas en otros módulos
module.exports = {
    createAprendiz,
    listAprendices,
    deleteAprendiz,
    updateAprendiz,
    searchAprendizByDocumento
};
