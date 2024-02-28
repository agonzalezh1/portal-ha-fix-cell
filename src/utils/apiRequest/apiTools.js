import { urlApis, environmentVariables, OPERATION_TYPE_TOOLS } from '../constants';
import axios from 'axios';

export const loadStocktaking = async ({ branch, data }) => {

    const config = {
        method: 'post',
        url: urlApis.tools,
        data: { branch, data, operationType: OPERATION_TYPE_TOOLS.LOAD_STOCKTAKING },
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
