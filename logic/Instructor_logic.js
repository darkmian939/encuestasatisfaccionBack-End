const User = require('../models/user_model');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const validator = require('validator')

// Validation schema for user object
const Schema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),
    lastName: Joi.string()
        .min(3)
        .max(30)
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu', 'co'] } })
        .required(),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    userType: Joi.string()
        .valid('admin', 'client') // Permitir solo 'admin' y 'client'
        .required()
});

// Async function to create a user
async function createUser(body) {
    try {
        // Verificar si el correo electrónico ya está registrado
        const emailExists = await checkUserExists(body.email);
        if (emailExists) {
            throw new Error('Este correo electrónico ya está registrado');
        }

        // Validar los datos del usuario según el esquema
        const value = await Schema.validateAsync(body);

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(value.password, 10);
        value.password = hashedPassword;

        // Crear un nuevo usuario con los datos validados y encriptados
        const user = new User(value);
        return await user.save();
    } catch (error) {
        throw new Error("Error creating user: " + error.message);
    }
}

// Async function to deactivate a user
async function deactivateUser(email) {
    try {
        return await User.findOneAndUpdate({ email: email }, { estado: false }, { new: true });
    } catch (error) {
        throw new Error("Error deactivating user: " + error.message);
    }
}

// Async function to list all active users
async function listActiveUsers() {
    try {
        return await User.find({ estado: true });
    } catch (error) {
        throw new Error("Error listing active users: " + error.message);
    }
}

// Async function to update user data
async function updateUser(email, data) {
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("User not found");
        }
        if (data.name) {
            user.name = data.name;
        }
        if (data.lastName) {
            user.lastName = data.lastName;
        }
        if (data.password) {
            user.password = await bcrypt.hash(data.password, 10); // Encripta la nueva contraseña
        }
        if (data.email) {
            user.email = data.email;
        }
        return await user.save();
    } catch (error) {
        throw new Error("Error updating user: " + error.message);
    }
}

// Async function to check if a user exists
async function checkUserExists(identifier) {
    try {
        const user = await User.findOne({
            $or: [{ name: identifier }, { email: identifier }]
        });
        return !!user;
    } catch (error) {
        throw new Error('Error verificando la existencia del usuario: ' + error.message);
    }
}

// Async function to authenticate a user
async function authenticateUser(email, password) {
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return { error: 'Usuario no encontrado', userType: null };
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return { error: 'Contraseña incorrecta', userType: null };
        }

        // Datos del usuario a devolver
        const userData = {
            userType: user.userType,
            name: user.name,
            lastName: user.lastName,
            email: user.email
            // Agrega aquí otros campos del usuario que necesites devolver
        };

        // Devolver los datos del usuario
        return { message: 'success', ...userData };
    } catch (error) {
        throw new Error("Error autenticando usuario: " + error.message);
    }
}

// Async function to reset user password
async function resetUserPassword(identifier, newPassword) {
    try {
        console.log('Recibido en la lógica:', identifier, newPassword);

        // Verificar si el usuario existe
        let user;
        if (validator.isEmail(identifier.trim())) { // Utiliza trim para eliminar espacios en blanco alrededor del correo
            user = await User.findOne({ email: identifier });
        } else {
            user = await User.findOne({ name: identifier });
        }

        if (!user) {
            return false; // Indicar que el usuario no fue encontrado
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña del usuario
        user.password = hashedPassword;
        await user.save();

        return true; // Indicar que la contraseña se ha restablecido correctamente
    } catch (error) {
        throw new Error('Error restableciendo contraseña del usuario: ' + error.message);
    }
}


module.exports = {
    Schema,
    createUser,
    updateUser,
    deactivateUser,
    listActiveUsers,
    checkUserExists,
    authenticateUser,
    resetUserPassword
};
