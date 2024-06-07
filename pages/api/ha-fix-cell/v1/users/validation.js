import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Employees from '../../../../../src/models/employees';
import { STATUS_CODE } from '../../../../../src/utils/constants';
import { validateLocation, hasLoginToday } from '../../../../../src/utils/functions';

const handler = async (req, res) => {
    let statusCode = STATUS_CODE.SUCCESSFUL;
    let message;
    let code = 0;
    let response;

    try {
        await connectDB();
        if (req.method !== 'POST') {
            statusCode = STATUS_CODE.BAD_REQUEST;
            message = 'Consulta incorrecta';
            code = STATUS_CODE.BAD_REQUEST;
        } else {
            const { user, password, latitude, longitude, currentDate } = req.body;
            //const result = await Employees.find({ password, username: user }, { grants: 1, profile: 1, store: 1});
            const result = await Employees.aggregate([
                { $match: { password, username: user }},
                { $addFields: { idStore: { $toObjectId: "$store"}} },
                { $lookup: {
                       from: "stores",
                       localField: "idStore",
                       foreignField: "_id",
                       as: "storeInformation"
                    }
                },
                {
                  $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$storeInformation", 0 ] }, "$$ROOT" ] } }
                },
                { $project: { storeInformation: 0, name: 0, password: 0, username: 0, cashFund: 0, address: 0, contactInfo: 0, dailySales: 0, sales: 0, idStore: 0 }}
            ])
            await disconnectDB();

            if (result.length) {
                if(validateLocation({
                    user,
                    storeInfo: {latitude: result[0].latitude, longitude: result[0].longitude},
                    latitude,
                    longitude
                })) {

                    const lastLogin = new Date(String(result[0].attendance.at(-1)));
                    if(!hasLoginToday(lastLogin)) {
                        await connectDB();
                        await Employees.updateOne(
                            { username: user },
                            { $push: { 'attendance': new Date() } }
                        );
                        await disconnectDB();
                    }
                    message = 'Consulta correcta';
                    response = {
                        grants: result[0].grants,
                        profile: result[0].profile,
                        store: result[0].store,
                    }
                } else {
                    code = STATUS_CODE.NOT_FOUND;
                    message = 'Te encuentras fuera del rango de tu tienda'
                }

            } else {
                code = STATUS_CODE.NOT_FOUND;
                message = 'Usuario y/o contraseña inválida';
            }
        }
    }  catch (error) {
        await disconnectDB();

        statusCode = STATUS_CODE.SERVER_ERROR;
        code = STATUS_CODE.SERVER_ERROR;
        message = `Error en el servidor: ${error.message}`;
    }

    res.status(statusCode).json({
        code,
        message,
        response,
    });
};

export default handler;
