import { urlApis } from '../constants';
import axios from 'axios';

export const authenticateUser =  async(user, password) => {
    const config = {
        method: 'post',
        url: urlApis.usersValidation,
        data: { user, password },
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
