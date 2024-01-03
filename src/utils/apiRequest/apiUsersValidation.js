import { urlApis, environmentVariables } from '../constants';
import axios from 'axios';

export const authenticateUser =  async(user, password) => {
    const config = {
        method: 'post',
        url: urlApis.usersValidation,
        data: { user, password },
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
