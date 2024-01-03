import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Stores from '../../../../../src/models/stores';
import { STATUS_CODE } from '../../../../../src/utils/constants';
import { Types } from 'mongoose';

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
        switch (req.method) {
            /**
             * Consulta de ventas al dia por tienda
             */
            case 'GET':
                const { idStore } = req.query;
                const result = await Stores.find({ _id : new Types.ObjectId(idStore)}, { dailySales: 1, cashFund: 1 });
                let spendAcc = 0;
                if (result[0].dailySales.spend.length > 0) {
                    spendAcc = result[0].dailySales.spend.reduce( (acc, current) => acc + current.amount, 0);
                }
                response = {
                    products: result[0].dailySales.products,
                    fixes: result[0].dailySales.fixes,
                    airtime: result[0].dailySales.airtime,
                    spend: spendAcc,
                    cashFund: result[0].cashFund,
                };
                message = 'Consulta correcta';
                break;
            /**
             * Realiza el reseteo de las ventas al dia (cuando le dan click al corte del dia)
             * El reinicio es en todas las tiendas
             */
            case 'POST':
                const { cashFund } = req.body;
                await Stores.updateMany(
                    {},
                    {$set: {
                        'cashFund': cashFund,
                        'dailySales.products.cashPayment': 0,
                        'dailySales.products.cardPayment': 0,
                        'dailySales.products.list': [],
                        'dailySales.fixes.cashPayment': 0,
                        'dailySales.fixes.cardPayment': 0,
                        'dailySales.airtime': 0,
                        'dailySales.spend': [],
                    }}
                );
                message = 'Actualizacion de ventas correcta';
                break;
            default:
                code = STATUS_CODE.BAD_REQUEST;
                message = 'Consulta incorrecta';
                break;
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
