import axios from 'axios';
import { environmentVariables } from '../utils/constants';

/**
 * Función para obtener un nuevo cliente HTTP para el consumo de APIS.
 * @param {object} headersRequest Arreglo de arreglos cadenas indicando llave/valor de cada cabecero para la peticion.
 * @returns {object} retorna un nuevo cliente HTTP configurado con los parametros proporcionados.
 */
const createClient = headersRequest => {
    return axios.create({
        headers: {
            'Content-Type': 'application/json',
            ...headersRequest,
        },
    });
};

/**
 * Funciones expuestas para el consumo del enpoint
 * @param {string} url - Recurso de APIGee a ejecutar.
 * @param {object} body - Objeto que será enviado en el body de la peticion.
 * @param {object} params - Parametros que se enviaran como query string de la peticion.
 * @param {array} headers - Arreglo de arreglos cadenas indicando llave/valor de cada cabecero para la peticion.
 * @param {number} timeout - tiempo en milisegundos que debe esperar antes de cancelar la peticion.
 */
const genericRequest = async ({ method, url, body, params, headers, timeout }) => {
    const client = createClient(headers);

    let timeoutRequest = environmentVariables.TIMEOUT_GLOBAL;
    if (timeout && timeout >= 1) {
        timeoutRequest = timeout;
    }

    const request = {
        url,
        method,
        params,
        data: body,
        timeout: timeoutRequest,
    };
    return client(request);
};

const getRequest = async ({ url, body, params, headers, timeout }) => {
    await genericRequest({ method: 'get', url, body, params, headers, timeout });
};

const postRequest = async ({ url, body, params, headers, timeout }) => {
    await genericRequest({ method: 'post', url, body, params, headers, timeout });
};

const putRequest = async ({ url, body, params, headers, timeout }) => {
    await genericRequest({ method: 'put', url, body, params, headers, timeout });
};

const deleteRequest = async ({ url, body, params, headers, timeout }) => {
    await genericRequest({ method: 'delete', url, body, params, headers, timeout });
};

export const httpFunctions = { getRequest, postRequest, putRequest, deleteRequest };
