import { urlApis } from '../constants';
import axios from 'axios';

export const getSalesByStore = async idStore => {
    const config = {
        method: 'get',
        url: `${urlApis.salesByStore}?idStore=${idStore}`,
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const restartSales = async () => {
    const config = {
        method: 'post',
        url: urlApis.salesByStore,
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const addSpendInStore = async ({ idStore, description, amount }) => {
    const config = {
        method: 'post',
        url: urlApis.spendByStore,
        data: { idStore, description, amount },
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
