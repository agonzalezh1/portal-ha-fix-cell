import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Products from '../../../../../src/models/products';
import { upperCase, capitalize } from '../../../../../src/utils/functions';
import { STATUS_CODE } from '../../../../../src/utils/constants';
import { Types } from 'mongoose';

const handler = async (req, res) => {
    let statusCode = STATUS_CODE.SUCCESSFUL;
    let message;
    let code = 0;
    let response;

    try {
        const { productName, brand, productType, wholesalePrice, midWholesalePrice, publicPrice, cost, stores, id } = req.body;
        const { idProduct } = req.query;
        await connectDB();
        switch (req.method) {
            case 'PUT':
                const idTemp = await Products.find().sort({ idProduct: -1 }).limit(1);
                const newID = idTemp[0].idProduct + 1;
                await Products.create({ idProduct: newID, productName, brand, productType, wholesalePrice, midWholesalePrice, publicPrice, cost, stores });
                await disconnectDB();
                message = 'Alta de producto correcta';
                break;
            case 'GET':
                let result;

                if (Number(idProduct)) {
                    result = await Products.find({ idProduct: Number(idProduct) });
                } else {
                    result = await Products.find({ productName: {$regex: upperCase(idProduct), $options: 'i'}});
                }

                await disconnectDB();
                if (result.length > 0) {
                    response = result.map(product => {
                        return {
                            id: product._id,
                            productName: capitalize(product.productName),
                            brand: product.brand.id,
                            productType: product.productType.id,
                            wholesalePrice: parseFloat(product.wholesalePrice),
                            midWholesalePrice: parseFloat(product.midWholesalePrice),
                            publicPrice: parseFloat(product.publicPrice),
                            cost: parseFloat(product.cost),
                            stores: product.stores,
                        };
                    });
                    message = 'Consulta correcta';
                } else {
                    code = STATUS_CODE.NOT_FOUND;
                    message = 'Producto no encontrado';
                }
                break;
            case 'POST':
                await Products.updateOne(
                    { _id : new Types.ObjectId(id)},
                    { $set: { wholesalePrice, midWholesalePrice, publicPrice, cost, stores} },
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
            message = `Error en el alta del producto: ${errorCode}`;
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
