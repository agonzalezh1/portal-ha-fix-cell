import { urlApis } from '../constants';
import axios from 'axios';

export const createProduct = async ({ productName, brand, productType, wholesalePrice, midWholesalePrice, publicPrice, cost, stores }) => {
    const config = {
        method: 'put',
        url: urlApis.products,
        data: { productName, brand, productType, wholesalePrice, midWholesalePrice, publicPrice, cost, stores },
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const getProductByName = async productName => {
    const config = {
        method: 'get',
        url: `${urlApis.products}?idProduct=${productName}`,
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const updateProduct = async ({ id, productName, wholesalePrice, midWholesalePrice, publicPrice, cost, stores }) => {
    const config = {
        method: 'post',
        url: urlApis.products,
        data: { id, productName, wholesalePrice, midWholesalePrice, publicPrice, cost, stores },
        timeout: 5000,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
