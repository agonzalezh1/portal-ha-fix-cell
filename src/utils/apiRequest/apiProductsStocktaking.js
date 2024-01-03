import { urlApis, environmentVariables } from '../constants';
import axios from 'axios';

export const updateStocktaking = async ({ products, idStore, total, saleType, paymentType }) => {
    const config = {
        method: 'post',
        url: urlApis.stocktaking,
        data: { products, idStore, total, saleType, paymentType },
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
