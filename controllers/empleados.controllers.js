/**
 * @author Miguel Pardal
 * @namespace Controladores Empleados
 */

const empleado = require('../models/empleados.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { use } = require('../middlewares/empleadoRoutes');
const saltRounds = 10;
const jwt_secret = process.env.ULTRA_SECRET_KEY;

/**
 * Controlador para leer un empleado por correo electrónico.
 *
 * @async
 * @function readEmpleadoByEmailController
 * @memberof Controladores Empleados
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise<void>} Responde con los detalles del empleado o un error.
 */
const readEmpleadoByEmailController = async (req, res) => {
    let empleados;
    try {
        const email = req.query.email_empleado;
        empleados = await empleado.getEmpleadoByEmail(email);
        if (empleados.length === 0) {
            return res.status(404).json({ msg: 'Empleado no encontrado' });
        }
        res.status(200).json(empleados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Controlador para crear un nuevo empleado.
 *
 * @async
 * @function createEmpleadoController
 * @memberof Controladores Empleados
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise<void>} Responde con el nuevo empleado creado o un error.
 */
const createEmpleadoController = async (req, res) => {
    const newEmpleado = req.body;

    if (
        "nombre_empleado" in newEmpleado &&
        "apellidos_empleado" in newEmpleado &&
        "email_empleado" in newEmpleado &&
        "password" in newEmpleado &&
        "rol" in newEmpleado
    ) {
        try {
            const hashPassword = await bcrypt.hash(newEmpleado.password, saltRounds);

            const empleadoToCreate = {
                nombre_empleado: newEmpleado.nombre_empleado,
                apellidos_empleado: newEmpleado.apellidos_empleado,
                email_empleado: newEmpleado.email_empleado,
                password: hashPassword,
                rol: newEmpleado.rol
            };

            const response = await empleado.createEmpleado(empleadoToCreate);
            res.status(201).json({
                items_created: response
            });
        } catch (error) {
            console.log('Database Error:', error);
            res.status(500).json({ error: "Error in the Database" });
        }
    } else {
        res.status(400).json({ error: "All fields are required" });
    }
};

/**
 * Controlador para iniciar sesión de un empleado.
 *
 * @async
 * @function login
 * @memberof Controladores Empleados
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise<void>} Responde con los detalles de autenticación o un error.
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const data = await empleado.getEmpleadoByEmail(email);

        if (!data || data.length === 0) {
            return res.status(400).json({ msg: 'Incorrect user or password' });
        }

        const userData = data[0];

        const match = await bcrypt.compare(password, userData.password);

        if (match) {
            await empleado.setLoggedTrue(email);

            const userForToken = {
                id: userData.id_empleado,
                rol: userData.rol,
                islogged: userData.is_logged
            };

            const token = jwt.sign(userForToken, jwt_secret, { expiresIn: '20m' });

            // res.cookie('token', token, { httpOnly: false, secure: true, maxAge: 20 * 60 * 1000 });
            res.cookie('token', token, { httpOnly: false, secure: true, SameSite: 'None', maxAge: 24 * 60 * 60 * 1000});

            res.status(200).json({
                msg: 'Correct authentication',
                rol: userData.rol,
                token,
                id: userData.id_empleado
            });

        } else {
            return res.status(400).json({ msg: 'Incorrect user or password' });
        }
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

/**
 * Controlador para cerrar sesión de un empleado.
 *
 * @async
 * @function logout
 * @memberof Controladores Empleados
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * @returns {Promise<void>} Responde con la confirmación de cierre de sesión o un error.
 */
const logout = async (req, res) => {
    try {
        console.log(req.cookies);
        const token = req.cookies.token;
        console.log('token', token)

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, jwt_secret);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        await empleado.updateLastLoggedDate(decoded.id);
        await empleado.setLoggedFalse(decoded.id);

        res.clearCookie('token');
        res.clearCookie('token2');

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    readEmpleadoByEmailController,
    createEmpleadoController,
    login,
    logout
};