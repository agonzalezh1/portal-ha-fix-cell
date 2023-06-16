import { connectDB, disconnectDB } from '../../../../../src/utils/dbConnect';
import Employees from '../../../../../src/models/employees';
import { STATUS_CODE } from '../../../../../src/utils/constants';

const handler = async (req, res) => {
    let statusCode = STATUS_CODE.SUCCESSFUL;
    let message;
    let code = 0;
    let response;
    try {
        await connectDB();
        const { username, password, name, store, grants, profile } = req.body;
        switch (req.method) {
            case 'PUT':
                await Employees.create({ username, password, name, store, grants, profile });
                await disconnectDB();
                message = 'Alta de usuario correcta';
                break;
            case 'POST':
                await Employees.updateOne({username}, { $set: { grants, store } });
                await disconnectDB();
                message = 'Actualización correcta';
                break;
            default:
                const result = await Employees.find({}, { _id: 0, password: 0});
                await disconnectDB();
                message = 'Consulta correcta';
                response = result;
                break;
        }
    } catch (error) {
        const errorCode = error['code'];

        if (errorCode === 11000) {
            statusCode = STATUS_CODE.BAD_REQUEST;
            code = 11000;
            message = `Error en el alta de usuario: ${errorCode}`;
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
