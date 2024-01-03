import { urlApis, environmentVariables } from '../constants';
import axios from 'axios';

export const createUser = async ({ username, name, password, store, grants, profile }) => {
    const config = {
        method: 'put',
        url: urlApis.users,
        data: { username, password, name, store, grants, profile },
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const getUsers = async() => {
    const config = {
        method: 'get',
        url: urlApis.users,
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data.response;
    } catch (error) {
        return error.response.data;
    }
};

export const modifyUser = async ({ username, grants, store }) => {
    const config = {
        method: 'post',
        url: urlApis.users,
        data: { username, grants, store },
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
