const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./controllers/user');
const reservationsRouter = require('./controllers/reservations');
const establishmentsRouter = require('./controllers/establishments');
const commentsRouter = require('./controllers/comments');

const app = express();

// Middleware para conectar a la base de datos MongoDB
mongoose.connect('mongodb+srv://crisca807:PARKIANDO@apiparkiandorest1.uzojh3u.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado a MongoDB...');
}).catch(err => {
    console.error('No se pudo conectar con MongoDB:', err);
});

// Middleware para el manejo de solicitudes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware CORS para permitir peticiones desde localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Endpoint /ping para verificar la conexión con el frontend
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Conexión establecida con el frontend' });
});

// Endpoints de la API
app.use('/api/user', usersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/establishments', establishmentsRouter);
app.use('/api/comments', commentsRouter);

// Puerto de escucha
const port = process.env.PORT || 3004;
app.listen(port, () => {
    console.log('API REST en funcionamiento en el puerto:', port);
});
