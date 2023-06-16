import { urlApis } from '../constants';
import axios from 'axios';

export const updateStocktaking = async ({ products, idStore, total, saleType }) => {
    const config = {
        method: 'post',
        url: urlApis.stocktaking,
        data: { products, idStore, total, saleType },
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
