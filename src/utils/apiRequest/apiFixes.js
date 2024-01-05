import { urlApis, PAYMENT_TYPE, environmentVariables } from '../constants';
import axios from 'axios';

export const createFolio = async ({ folio, date, customerName, phoneNumber, fixes, comments, advancePayment, total, store }) => {
    const config = {
        method: 'put',
        url: urlApis.fixes,
        data: { folio, date, customerName, phoneNumber, fixes, comments, advancePayment, total, store },
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const findFolio = async({ folio }) => {
    const config = {
        method: 'get',
        url: `${urlApis.fixes}?data=${folio}`,
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const updateFix = async({ folio, comments, status, total }) => {
    const config = {
        method: 'post',
        url: `${urlApis.fixes}`,
        data: { folio, comments, status, total },
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const addAdvancePayment = async({ folio, advancePayment }) => {
    const config = {
        method: 'post',
        url: `${urlApis.fixesPayments}`,
        data: { folio, advancePayment },
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const fixTotalPayment = async({ idStore, folio, total, advancePayment, paymentType, deliveryDate }) => {
    const totalAdvancePayment = advancePayment.reduce( (acc, current) => acc + current.amount, 0);
    const missingAmount = total - totalAdvancePayment;
    const initialPayment = { cashPayment: 0, cardPayment: 0 };

    const payment = advancePayment.reduce( (acc, current) => {
        if (current.type === PAYMENT_TYPE.CASH) {
            return {
                cashPayment: acc.cashPayment + current.amount,
                cardPayment: acc.cardPayment,
            };
        } else {
            return {
                cashPayment: acc.cashPayment,
                cardPayment: acc.cardPayment + current.amount,
            };
        }
    }, initialPayment);

    if (paymentType === PAYMENT_TYPE.CASH) {
        payment.cashPayment = payment.cashPayment + missingAmount;
    } else {
        payment.cardPayment = payment.cardPayment + missingAmount;
    }

    const config = {
        method: 'put',
        url: urlApis.fixesPayments,
        data: { idStore, folio, deliveryDate, fixPayment: {...payment} },
        timeout: environmentVariables.TIMEOUT_GLOBAL,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

