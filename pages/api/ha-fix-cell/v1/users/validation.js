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
        if (req.method !== 'POST') {
            statusCode = STATUS_CODE.BAD_REQUEST;
            message = 'Consulta incorrecta';
            code = STATUS_CODE.BAD_REQUEST;
        } else {
            const { user, password } = req.body;
            const result = await Employees.find({ password, username: user }, { grants: 1, profile: 1, store: 1});
            await disconnectDB();

            if (result.length) {
                message = 'Consulta correcta';
                response = {
                    grants: result[0].grants,
                    profile: result[0].profile,
                    store: result[0].store,
                };
            } else {
                code = STATUS_CODE.NOT_FOUND;
                message = 'Usuario y/o contraseña inválida';
            }
        }
    }  catch (error) {
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
