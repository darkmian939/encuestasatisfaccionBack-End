const express = require('express');
const router = express.Router();
const logic = require('../logic/user_logic');
const nodemailer = require('nodemailer');

router.post('/send-email', async (req, res) => {
    const { email } = req.body;

    try {
        // Verificar si el usuario existe
        const userExists = await logic.checkUserExists(email);
        if (!userExists) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Configurar el transporte del correo electrónico usando nodemailer
        let transporter = nodemailer.createTransport({
            service: 'Gmail', // Aquí puedes usar otros servicios como 'SMTP'
            auth: {
                user: 'crisca807@gmail.com', // Coloca aquí el correo desde el que enviarás los correos
                pass: 'aihw ontj qary qixj' // Coloca aquí la contraseña de tu correo
            }
        });

        // Configurar el contenido del correo electrónico
        let mailOptions = {
            from: 'crisca807@gmail.com',
            to: email,
            subject: 'Restablecimiento de contraseña',
            text: 'Hola, has solicitado restablecer tu contraseña. Por favor, sigue las instrucciones para continuar.'
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Correo electrónico enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        res.status(400).json({ error: 'No se pudo enviar el correo electrónico' });
    }
});
// Endpoint para verificar si un usuario existe
router.post('/check-account', async (req, res) => {
    try {
        const { email } = req.body;
        const exists = await logic.checkUserExists(email);
        res.json({ userExists: exists });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint para autenticar un usuario
router.post('/auth', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { userType, name, lastName, email: userEmail, error } = await logic.authenticateUser(email, password);

        if (error) {
            return res.status(401).json({ message: 'failed', error });
        }

        // Si la autenticación es exitosa, envía el tipo de usuario y los datos del usuario
        res.json({ message: 'success', userType, user: { name, lastName, email: userEmail } });
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).json({ message: 'failed', error: 'Error al autenticar usuario. Por favor, inténtalo de nuevo más tarde.' });
    }
});



// GET endpoint para obtener todos los usuarios activos
router.get('/', async (req, res) => {
    try {
        const users = await logic.listActiveUsers();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST endpoint para crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, email, password, tipoUsuario } = req.body;

        // Verificar si el correo electrónico ya está registrado
        const emailExists = await logic.checkUserExists(email);
        if (emailExists) {
            return res.status(400).json({ error: 'Este correo electrónico ya está registrado' });
        }

        // Crear el usuario utilizando la función actualizada
        const user = await logic.createUser({
            name: nombre,
            lastName: apellido,
            email: email,
            password: password,
            userType: tipoUsuario
        });

        res.json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT endpoint para actualizar los datos de un usuario
router.put('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { error } = logic.Schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const result = await logic.updateUser(email, req.body);
        res.json({ user: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE endpoint para desactivar un usuario
router.delete('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await logic.deactivateUser(email);
        res.json({ user: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST endpoint para restablecer la contraseña
router.post('/reset-password', async (req, res) => {
    const { identifier, newPassword } = req.body;

    console.log('Recibido en el controlador:', identifier, newPassword);

    try {
        // Actualizar la contraseña del usuario
        const passwordResetSuccess = await logic.resetUserPassword(identifier, newPassword);

        if (passwordResetSuccess) {
            return res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
        } else {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(400).json({ error: 'No se pudo restablecer la contraseña' });
    }
});



module.exports = router;
