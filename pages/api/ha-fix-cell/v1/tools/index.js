import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Products from '../../../../../src/models/products';
import { STATUS_CODE, OPERATION_TYPE_TOOLS } from '../../../../../src/utils/constants';

const updateStocktaking = async(branch, data) => {
    const bulkData = [];

    data.forEach(element => {
        bulkData.push({
            updateOne: {
                filter: { idProduct: element.id},
                update: { $set: { 'stores.$[updateProduct].count': element.count }},
                arrayFilters: [{ 'updateProduct.id': branch }] ,
            }
        })
    });

    return Products.bulkWrite(bulkData);
}

const handler = async (req, res) => {
    let statusCode = STATUS_CODE.SUCCESSFUL;
    let message;
    let code = 0;
    let response;

    try {
        const { branch, data, operationType } = req.body;
        await connectDB();
        if(operationType === OPERATION_TYPE_TOOLS.LOAD_STOCKTAKING) {
            const result = await updateStocktaking(branch, JSON.parse(data));
            await disconnectDB();
            message = 'Carga de inventario correcta';
            response = result;
        }
    } catch (error) {
        console.log(error);
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
