import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Stores from '../../../../../src/models/stores';
import Fixes from '../../../../../src/models/fixes';
import { SALES_TYPE, STATUS_CODE } from '../../../../../src/utils/constants';
import { Types } from 'mongoose';
import { getPeriod } from '../../../../../src/utils/functions';

/**
 * Se arma la consulta para la actualización de la venta por reparacion
 * @param {string} idStore Identificador de la tienda
 * @param {object} fixPayment Objeto con la información de los pagos del folio.
 *                  Acumulado de todos los abonos y agrupados por tipo
 */
const updateFixSales = async ({ idStore, fixPayment }) => {
    const currentPeriod = getPeriod();
    const query = {
        'sales.$[updatePeriod].fixes.cashPayment': fixPayment.cashPayment,
        'sales.$[updatePeriod].fixes.cardPayment': fixPayment.cardPayment,
        'dailySales.fixes.cashPayment': fixPayment.cashPayment,
        'dailySales.fixes.cardPayment': fixPayment.cardPayment,
    };

    const result = await Stores.updateOne(
        { _id: new Types.ObjectId(idStore) },
        { $inc: query },
        { arrayFilters: [{ 'updatePeriod.period': currentPeriod }] },
    );
        console.log(result);
    return {
        sucursal: result.modifiedCount === 1 ? 'OK' : idStore,
        tipo: SALES_TYPE.SERVICES,
        esError: result.matchedCount === 0 || result.modifiedCount === 0 ? true : false,
    };
};


/**
 * Controlador para gestionar los pagos de las reparaciones
 * @param {*} req Peticion
 * @param {*} res Respuesta
 */
const handler = async (req, res) => {
    let statusCode = STATUS_CODE.SUCCESSFUL;
    let message;
    let code = 0;
    let response;

    try {
        const { advancePayment, idStore, folio, fixPayment } = req.body;
        await connectDB();
        switch (req.method) {
            /**
             * Liquidar folio de reparacion
             */
            case 'PUT':
                const errores = [];

                const resp1 = await updateFixSales({ idStore, fixPayment });
                if (resp1.esError) {
                    errores.push(resp1);
                } else {
                    const currentDate = new Date().setHours(0, 0, 0, 0);
                    const resp2 = await Fixes.updateOne(
                        { folio },
                        { $set: { status: 5, deliveryDate: currentDate } } );

                    if (resp2.esError) {
                        errores.push(resp2);
                    }
                }

                message = 'Venta guardada correctamente';
                response = errores;
                break;
            /**
             * Pago por adelantado
             */
            case 'POST':
                await Fixes.updateOne(
                    { folio },
                    { $push: { advancePayment } },
                );
                message = 'Actualizacion correcta';
                break;
            default:
                code = STATUS_CODE.BAD_REQUEST;
                message = 'Consulta incorrecta';
                break;
        }

    } catch (error) {
        console.log(error);
        await disconnectDB();
        statusCode = STATUS_CODE.SERVER_ERROR;
        code = STATUS_CODE.SERVER_ERROR;
        message = `Error en el servidor: ${error}`;
    }

    res.status(statusCode).json({
        code,
        message,
        response,
    });
};

export default handler;
