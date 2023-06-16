import { urlApis } from '../constants';
import axios from 'axios';

export const createUser = async ({ username, name, password, store, grants, profile }) => {
    const config = {
        method: 'put',
        url: urlApis.users,
        data: { username, password, name, store, grants, profile },
        timeout: 5000,
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
        timeout: 5000,
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
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
