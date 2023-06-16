import { urlApis } from '../constants';
import { getPeriod } from '../functions';
import axios from 'axios';

export const getStores = async() => {
    const config = {
        method: 'get',
        url: urlApis.stores,
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const createStore = async name => {
    const config = {
        method: 'put',
        url: urlApis.stores,
        data: { name, period: getPeriod() },
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
