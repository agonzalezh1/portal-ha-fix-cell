import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Products from '../../../../../src/models/products';
import Stores from '../../../../../src/models/stores';
import { SALES_TYPE, STATUS_CODE } from '../../../../../src/utils/constants';
import { Types } from 'mongoose';
import { getPeriod } from '../../../../../src/utils/functions';

const updateStocktaking = async ({ idProduct, idStore, count }) => {
    const result = await Products.updateOne(
        { _id: new Types.ObjectId(idProduct) },
        { $inc: { 'stores.$[updateID].count': (count * -1) } },
        { arrayFilters: [{ 'updateID.id': idStore }] },
    );

    return {
        producto: result.matchedCount === 1 ? 'OK' : idProduct,
        sucursal: result.modifiedCount === 1 ? 'OK' : idStore,
        esError: result.matchedCount === 0 || result.modifiedCount === 0 ? true: false,
    };
};

const updateSales = async ({idStore, total, saleType}) => {
    const currentPeriod = getPeriod();
    let query;

    if (saleType === SALES_TYPE.PRODUCTS) {
        query = { 'sales.$[updatePeriod].products': total, 'dailySales.products': total };
    } else if (saleType === SALES_TYPE.SERVICES) {
        query = { 'sales.$[updatePeriod].fixes': total, 'dailySales.fixes': total };
    } else {
        query = { 'sales.$[updatePeriod].airtime': total, 'dailySales.airtime': total };
    }

    const result = await Stores.updateOne(
        { _id: new Types.ObjectId(idStore) },
        { $inc: query },
        { arrayFilters: [{ 'updatePeriod.period': currentPeriod }] },
    );

    return {
        sucursal: result.modifiedCount === 1 ? 'OK' : idStore,
        tipo: saleType,
        esError: result.matchedCount === 0 || result.modifiedCount === 0 ? true: false,
    };
};

const handler = async (req, res) => {
    let statusCode = STATUS_CODE.SUCCESSFUL;
    let message;
    let code = 0;
    let response;

    try {
        await connectDB();
        if (req.method === 'POST') {
            const { products, idStore, total, saleType } = req.body;
            const errores = [];

            if (saleType === SALES_TYPE.PRODUCTS) {
                products.forEach(async product => {
                    const obj = { idStore, idProduct: product.id, count: product.count };
                    const resp = await updateStocktaking(obj);
                    if (resp.esError) {
                        errores.push(resp);
                    }
                });
            }

            const resp2 = await updateSales({idStore, total, saleType});

            if (resp2.esError) {
                errores.push(resp2);
            }

            message = 'Venta guardada correctamente';
            response = errores;

        } else {
            code = STATUS_CODE.BAD_REQUEST;
            message = 'Consulta incorrecta';
        }

    } catch (error) {
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
