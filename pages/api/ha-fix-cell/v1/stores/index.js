import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Stores from '../../../../../src/models/stores';
import { STATUS_CODE } from '../../../../../src/utils/constants';

/**
 * Controlador que administra las operaciones del recurso de las sucursales
 * @param {*} req Peticion
 * @param {*} res Respuesta
 */
const handler = async (req, res) => {
    let statusCode = STATUS_CODE.SUCCESSFUL;
    let message;
    let code = 0;
    let response;

    try {
        await connectDB();
        switch (req.method) {
            /**
             * Crea una sucursal
             * Se recibe el nombre de la sucursal
             * y el periodo de actual con formato MM/YYYY
             */
            case 'PUT':
                const { name, period } = req.body;
                await Stores.create({ name, period });
                await disconnectDB();
                message = 'Alta de sucursal correcta';
                break;
            /**
             * Obtiene la informacion de todas las sucursales
             */
            case 'GET':
                const resultGet = await Stores.find({});
                if (resultGet.length) {
                    message = 'Consulta correcta';
                    response = { stores: resultGet };
                } else {
                    code = STATUS_CODE.NOT_FOUND;
                    message = 'No hay informacion disponible';
                }
                break;
            default:
                code = STATUS_CODE.BAD_REQUEST;
                message = 'Consulta incorrecta';
                break;
        }
    } catch (error) {
        await disconnectDB();

        const errorCode = error['code'];

        if (errorCode === 11000) {
            statusCode = STATUS_CODE.BAD_REQUEST;
            code = 11000;
            message = `Error en el alta de sucursal: ${errorCode}`;
        } else {
            statusCode = STATUS_CODE.SERVER_ERROR;
            code = errorCode;
            message = `Error en el servidor: ${errorCode}`;
        }
    }

    res.status(statusCode).json({
        code,
        message,
        response,
    });
};

export default handler;
