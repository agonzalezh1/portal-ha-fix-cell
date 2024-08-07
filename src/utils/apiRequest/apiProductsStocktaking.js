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

export const deleteProductSold = async ({idSale, paymentType, total, idStore, productName}) => {
    const config = {
        method: 'delete',
        url: urlApis.stocktaking,
        data: {idSale, paymentType, total, idStore, productName},
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}
