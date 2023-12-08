import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import { v4 as uuidv4 } from 'uuid';
import Products from '../../../../../src/models/products';
import Stores from '../../../../../src/models/stores';
import Logs from '../../../../../src/models/log';
import { SALES_TYPE, STATUS_CODE, PAYMENT_TYPE, SEVERITY_TYPE } from '../../../../../src/utils/constants';
import { Types } from 'mongoose';
import { getPeriod } from '../../../../../src/utils/functions';

const logTransaction = ({uuid, severity, component, store, msg}) => {
    try {
        const obj = {
            time: new Date(),
            severity,
            uuid,
            component,
            context: { store },
            message: msg,
        };
        Logs.create(obj);
    } catch (error) {
        console.log(error);
    }
};

/**
 * Actualiza el inventario de una tienda
 * @param {string} idProduct ObjectId del producto
 * @param {string} idStore ObjectId de la tienda
 * @param {number} count Cantidad a descontar del inventario
 * @param {string} uuid Identificador de la transaccion
 */
const updateStocktaking = async ({ idProduct, idStore, count, uuid }) => {
    logTransaction({
        uuid,
        severity: SEVERITY_TYPE.INFO,
        component: 'updateStocktaking',
        store: idStore,
        msg: JSON.stringify({
            _id: idProduct,
            $inc: { count: (count * -1) },
            arrayFilters: { store: idStore },
        }),
    });

    const result = await Products.updateOne(
        { _id: new Types.ObjectId(idProduct) },
        { $inc: { 'stores.$[updateID].count': (count * -1) } },
        { arrayFilters: [{ 'updateID.id': idStore }] },
    );

    logTransaction({
        uuid,
        severity: SEVERITY_TYPE.INFO,
        component: 'updateStocktaking',
        store: idStore,
        msg: JSON.stringify(result),
    });

    return {
        producto: result.matchedCount === 1 ? 'OK' : idProduct,
        sucursal: result.modifiedCount === 1 ? 'OK' : idStore,
        esError: result.matchedCount === 0 || result.modifiedCount === 0 ? true: false,
    };
};

/**
 * Actualizacion de ventas en una tienda
 * @param {string} idStore ObjectId de la tienda
 * @param {number} total Cantidad total de la venta
 * @param {string} saleType Tipo de venta (Productos, reparacion, tiempo aire)
 * @param {string} paymentType Forma de pago
 * @param {array} prodyct Lista de productos vendidos (id, cantidad, total, nombre)
 * @param {string} uuid Identificador de la transaccion
 */
const updateSales = async ({idStore, total, saleType, paymentType, products, uuid }) => {
    const currentPeriod = getPeriod();
    let query;

    if (saleType === SALES_TYPE.PRODUCTS) {
        if (paymentType === PAYMENT_TYPE.CASH) {
            query = { 'sales.$[updatePeriod].products.cashPayment': total, 'dailySales.products.cashPayment': total };
        } else {
            query = { 'sales.$[updatePeriod].products.cardPayment': total, 'dailySales.products.cardPayment': total };
        }
    } else if (saleType === SALES_TYPE.SERVICES) {
        if (paymentType === PAYMENT_TYPE.CASH) {
            query = { 'sales.$[updatePeriod].fixes.cashPayment': total, 'dailySales.fixes.cashPayment': total };
        } else {
            query = { 'sales.$[updatePeriod].fixes.cardPayment': total, 'dailySales.fixes.cardPayment': total };
        }
    } else {
        query = { 'sales.$[updatePeriod].airtime': total, 'dailySales.airtime': total };
    }

    logTransaction({
        uuid,
        severity: SEVERITY_TYPE.INFO,
        component: 'updateSales',
        store: idStore,
        msg: JSON.stringify({
            _id: idStore,
            $inc: query,
            $push: { 'dailySales.products.list': { $each: products? products : [] } },
            arrayFilters: [{ 'updatePeriod.period': currentPeriod }],
        }),
    });

    const result = await Stores.updateOne(
        { _id: new Types.ObjectId(idStore) },
        {
            $inc: query,
            $push: { 'dailySales.products.list': { $each: products? products : [] } },
        },
        { arrayFilters: [{ 'updatePeriod.period': currentPeriod }] },
    );

    logTransaction({
        uuid,
        severity: SEVERITY_TYPE.INFO,
        component: 'updateSales',
        store: idStore,
        msg: JSON.stringify(result),
    });

    return {
        sucursal: result.modifiedCount === 1 ? 'OK' : idStore,
        tipo: saleType,
        esError: result.matchedCount === 0 || result.modifiedCount === 0 ? true: false,
    };
};

/**
 * Controlador para administrar el inventario de las tiendas
 * @param {*} req Peticion
 * @param {*} res Respuesta
 */
const handler = async (req, res) => {
    let statusCode = STATUS_CODE.SUCCESSFUL;
    let message;
    let code = 0;
    let response;

    const uuid = uuidv4();

    try {
        await connectDB();
        /**
         * Actualizacion del inventario
         * Recibe una lista de productos junto con el total
         * Por cada producto realiza la actualizacion en la coleccion Products
         * Al final realiza la actualizacion de las ventas en la coleccion Stores
         */
        if (req.method === 'POST') {
            const { products, idStore, total, saleType, paymentType } = req.body;
            const errores = [];

            // Actualizacion del inventario
            if (saleType === SALES_TYPE.PRODUCTS) {
                for ( const product of products ) {
                    const obj = { idStore, idProduct: product.id, count: product.count, uuid };
                    const resp = await updateStocktaking(obj);
                    if (resp.esError) {
                        errores.push(resp);
                    }
                }
            }

            // Actualizacion de las ventas
            const resp2 = await updateSales({idStore, total, saleType, paymentType, products, uuid});

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
