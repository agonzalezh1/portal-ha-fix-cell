import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Fixes from '../../../../../src/models/fixes';
import { upperCase } from '../../../../../src/utils/functions';
import { STATUS_CODE } from '../../../../../src/utils/constants';

/**
 * Controlador que realiza la administracion de folios de reparacion
 * @param {*} req Peticion
 * @param {*} res Respuesta
 */
const handler = async (req, res) => {
    let statusCode = STATUS_CODE.SUCCESSFUL;
    let message;
    let code = 0;
    let response;

    try {
        const { folio, date, customerName, fixes, comments, advancePayment, total, store, status } = req.body;
        const { data } = req.query;
        await connectDB();
        switch (req.method) {
            case 'PUT':
                const fix = await Fixes.find().sort({ _id: -1 }).limit(1);
                const newFolio = fix[0].folio + 1;
                await Fixes.create({ customerName, date, fixes, store, comments, total, advancePayment, folio: newFolio });
                await disconnectDB();
                message = 'Alta de folio correcta';
                response = { folio: newFolio };
                break;
            case 'GET':
                let result;
                if (Number(data)) {
                    result = await Fixes.find({ folio: data }, { _id: 0 });
                    await disconnectDB();
                } else {
                    result = await Fixes.find({ customerName: {$regex: upperCase(data), $options: 'i'}}, { _id: 0 });
                    await disconnectDB();
                }

                if (result.length > 0) {
                    response = result;
                    message = 'Consulta correcta';
                } else {
                    code = STATUS_CODE.NOT_FOUND;
                    message = 'Registro no encontrado';
                }
                break;
            case 'POST':
                await Fixes.updateOne(
                    { folio },
                    { $set: { total, status }, $push: { comments } },
                );
                message = 'Actualizacion correcta';
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
            code = errorCode;
            message = `Error en el alta del servicio: ${errorCode}`;
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
