import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Stores from '../../../../../src/models/stores';
import { STATUS_CODE } from '../../../../../src/utils/constants';
import { Types } from 'mongoose';

const handler = async (req, res) => {
    let statusCode = STATUS_CODE.SUCCESSFUL;
    let message;
    let code = 0;
    let response;

    try {
        await connectDB();
        switch (req.method) {
            case 'GET':
                const { idStore } = req.query;
                const result = await Stores.find({ _id : new Types.ObjectId(idStore)}, { dailySales: 1 });
                response = {
                    products: result[0].dailySales.products,
                    fixes: result[0].dailySales.fixes,
                    airtime: result[0].dailySales.airtime,
                };
                message = 'Consulta correcta';
                break;
            case 'POST':
                await Stores.updateMany(
                    {},
                    {$set: {'dailySales.products': 0, 'dailySales.fixes': 0, 'dailySales.airtime': 0}}
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
