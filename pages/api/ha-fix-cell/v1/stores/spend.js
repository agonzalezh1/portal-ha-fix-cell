import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Stores from '../../../../../src/models/stores';
import { STATUS_CODE } from '../../../../../src/utils/constants';
import { Types } from 'mongoose';
import { getPeriod } from '../../../../../src/utils/functions';

/**
 * Controlador que realiza la consulta de las ventas por tienda
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
        /**
         * Agrega un gasto en la tienda
         * Actualiza el gasto diario y el gasto mensual
         */
        if (req.method === 'POST') {
            const { idStore, description, amount } = req.body;
            const currentPeriod = getPeriod();

            await Stores.updateOne(
                { _id: new Types.ObjectId(idStore) },
                {
                    $inc: { 'sales.$[updatePeriod].spend': amount },
                    $push: { 'dailySales.spend': { description, amount }},
                },
                { arrayFilters: [{ 'updatePeriod.period': currentPeriod }] },
            );

            message = 'Actualizacion de gastos correcta';

        } else {
            code = STATUS_CODE.BAD_REQUEST;
            message = 'Consulta incorrecta';
        }
    } catch (error) {
        await disconnectDB();

        const errorCode = error['code'];
        statusCode = STATUS_CODE.SERVER_ERROR;
        code = errorCode;
        message = `Error en el servidor: ${errorCode}`;
    }

    res.status(statusCode).json({
        code,
        message,
        response,
    });
};

export default handler;
