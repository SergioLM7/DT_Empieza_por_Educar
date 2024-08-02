/**
 * @author Sergio Lillo
 * @namespace Modelos Candidatos
 */

const queries = require('../queries/candidatos.queries')
const connection = require('../config/db_mysql');

/**
 * Crea un nuevo registro de candidato en la base de datos.
 *
 * @async
 * @function createCandidato
 * @memberof Modelos Candidatos
 * @param {Object} entry - El objeto que contiene los detalles del candidato.
 * @param {string} entry.nombre_candidato - El nombre del candidato.
 * @param {string} entry.apellidos_candidato - Los apellidos del candidato.
 * @param {string} entry.email_candidato - La dirección de correo electrónico del candidato.
 * @param {string} entry.telefono_candidato - El teléfono del candidato.
 * @param {number} entry.edad - La edad del candidato.
 * @param {string} entry.carrera - La carrera del candidato.
 * @param {number} entry.nota_media - La nota media del candidato.
 * @param {string} entry.nivel_ingles - El nivel de inglés del candidato.
 * @param {string} entry.sexo - El sexo del candidato.
 * @param {string} entry.cv - El CV del candidato.
 * @returns {Promise<Object>} Una promesa que se resuelve con un objeto indicando el éxito de la operación y el ID insertado.
 * @throws {Error} Lanza un error si la consulta a la base de datos falla.
 */
const createCandidato = async (entry) => {
    const { nombre_candidato, apellidos_candidato, email_candidato, telefono_candidato, edad, carrera, nota_media, nivel_ingles, sexo, cv } = entry;
    return new Promise((resolve, reject) => {
        connection.query(queries.createCandidato, [nombre_candidato, apellidos_candidato, email_candidato, telefono_candidato, edad, carrera, nota_media, nivel_ingles, sexo, cv], (error, results) => {
            if (error) {
                console.log(error);
                reject({
                    success: false,
                    message: 'Error al crear el candidato',
                    error: error
                });
            } else {
                resolve({
                    success: true,
                    message: 'Candidato creado exitosamente',
                    insertId: results.insertId
                });
            }
        });
    });
};

/**
 * Obtiene un registro de candidato por su correo electrónico.
 *
 * @async
 * @function readCandidatoEmail
 * @memberof Modelos Candidatos
 * @param {string} email_candidato - La dirección de correo electrónico del candidato.
 * @returns {Promise<Object>} Una promesa que se resuelve con el resultado de la consulta a la base de datos.
 * @throws {Error} Lanza un error si la consulta a la base de datos falla.
 */
const readCandidatoEmail = async (email_candidato) => {
    return new Promise((resolve, reject) => {
        connection.query(queries.readCandidatoEmail, [email_candidato], (error, results) => {
            if (error) {
                console.log(error);
                reject({
                    success: false,
                    message: 'Error al obtener el candidato',
                    error: error
                });
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * Obtiene todos los registros de candidatos con paginación.
 *
 * @async
 * @function readAllCandidatos
 * @memberof Modelos Candidatos
 * @param {number} limit - El número máximo de resultados.
 * @param {number} offset - El desplazamiento para la paginación.
 * @returns {Promise<Object>} Una promesa que se resuelve con los resultados de la consulta a la base de datos.
 * @throws {Error} Lanza un error si la consulta a la base de datos falla.
 */
const readAllCandidatos = async (limit, offset) => {
    return new Promise((resolve, reject) => {
        connection.query(queries.readAllCandidatos, [limit, offset], (error, results) => {
            if (error) {
                console.log(error);
                reject({
                    success: false,
                    message: 'Error al acceder a los candidatos',
                    error: error
                });
            } else {
                resolve(results);
            }
        });
    });
};

/**
 * Actualiza un registro de candidato en la base de datos.
 *
 * @async
 * @function updateCandidato
 * @memberof Modelos Candidatos
 * @param {Object} entry - El objeto que contiene los detalles del candidato a actualizar.
 * @param {string} entry.nombre_candidato - El nombre del candidato.
 * @param {string} entry.apellidos_candidato - Los apellidos del candidato.
 * @param {string} entry.email_candidato - La dirección de correo electrónico del candidato.
 * @param {string} entry.telefono_candidato - El teléfono del candidato.
 * @param {number} entry.edad - La edad del candidato.
 * @param {string} entry.carrera - La carrera del candidato.
 * @param {number} entry.nota_media - La nota media del candidato.
 * @param {string} entry.nivel_ingles - El nivel de inglés del candidato.
 * @param {string} entry.sexo - El sexo del candidato.
 * @param {string} entry.cv - El CV del candidato.
 * @param {number} entry.id_candidato - El ID del candidato.
 * @returns {Promise<Object>} Una promesa que se resuelve con un objeto indicando el éxito de la operación y el número de filas cambiadas.
 * @throws {Error} Lanza un error si la consulta a la base de datos falla.
 */
const updateCandidato = async (entry) => {
    const { nombre_candidato, apellidos_candidato, email_candidato, telefono_candidato, edad, carrera, nota_media, nivel_ingles, sexo, cv, id_candidato } = entry;
    return new Promise((resolve, reject) => {
        connection.query(queries.updateCandidato, [nombre_candidato, apellidos_candidato, email_candidato, telefono_candidato, edad, carrera, nota_media, nivel_ingles,sexo, cv, id_candidato], (error, results) => {
            if (error) {
                console.log(error);
                reject({
                    success: false,
                    message: 'Error al editar el candidato',
                    error: error
                });
            } else {
                resolve({
                    success: true,
                    message: 'Candidato editado con éxito',
                    changedRows: results.changedRows
                });
            }
        });
    });
};

/**
 * Elimina un registro de candidato de la base de datos.
 *
 * @async
 * @function deleteCandidato
 * @memberof Modelos Candidatos
 * @param {number} id_candidato - El ID del candidato.
 * @returns {Promise<Object>} Una promesa que se resuelve con un objeto indicando el éxito de la operación.
 * @throws {Error} Lanza un error si la consulta a la base de datos falla.
 */
const deleteCandidato = async (id_candidato) => {
    return new Promise((resolve, reject) => {
        connection.query(queries.deleteCandidato, [id_candidato], (error, results) => {
            if (error) {
                console.log(error);
                reject({
                    success: false,
                    message: 'Error al eliminar el candidato',
                    error: error
                });
            } else {
                resolve({
                    success: true,
                    message: 'Candidato eliminado con éxito',
                });
            }
        });
    });
};



const candidatos = {
    createCandidato,
    readCandidatoEmail,
    readAllCandidatos,
    updateCandidato,
    deleteCandidato
}

module.exports = candidatos;
