const mongoose = require('mongoose');

const aprendizSchema = new mongoose.Schema({
    ficha: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    jornada: {
        type: String,
        required: true
    },
    numeroDocumento: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: true
    },
    correoElectronico: {
        type: String,
        required: true
    },
    // Otros campos que corresponden a las evaluaciones
    estableceRelaciones: {
        type: String,
        required: true
    },
    socializaResultados: {
        type: String,
        required: true
    },
    aplicaEstrategias: {
        type: String,
        required: true
    },
    orientaFormacion: {
        type: String,
        required: true
    },
    incentivaUsoPlataforma: {
        type: String,
        required: true
    },
    orientaConGuias: {
        type: String,
        required: true
    },
    puntualidadInicio: {
        type: String,
        required: true
    },
    demuestraDominio: {
        type: String,
        required: true
    },
    proponeFuentes: {
        type: String,
        required: true
    },
    brindaApoyoFPI: {
        type: String,
        required: true
    },
    revisaPlanesMejoramiento: {
        type: String,
        required: true
    },
    mejoraActitudinal: {
        type: String,
        required: true
    }
    // Agrega más campos según sea necesario
});

const Aprendiz = mongoose.model('Aprendiz', aprendizSchema);

module.exports = Aprendiz;
