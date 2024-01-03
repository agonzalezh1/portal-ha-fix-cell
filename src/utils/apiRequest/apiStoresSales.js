import { urlApis, environmentVariables } from '../constants';
import axios from 'axios';

export const getSalesByStore = async idStore => {
    const config = {
        method: 'get',
        url: `${urlApis.salesByStore}?idStore=${idStore}`,
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const restartSales = async ({ cashFund }) => {
    const config = {
        method: 'post',
        url: urlApis.salesByStore,
        data: { cashFund },
        timeout: environmentVariables.TIMEOUT_GLOBAL,
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
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
