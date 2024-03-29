import { createSlice } from '@reduxjs/toolkit';
import { PAYMENT_TYPE } from '../utils/constants';

const initialState = {
    products: { cashPayment: 0, cardPayment: 0, list: [] },
    fixes: { cashPayment: 0, cardPayment: 0 },
    airtime: 0,
    spend: 0,
    cashFund: 0,
};

export const salesSlice = createSlice({ name: 'sales', initialState,
    reducers: {
        addProductSale: (state, action) => {
            if (action.payload.paymentType === PAYMENT_TYPE.CASH) {
                state.products.cashPayment += action.payload.total;
            } else {
                state.products.cardPayment += action.payload.total;
            }
            state.products.list = state.products.list.concat(action.payload.products);
        },
        addFixSale: (state, action) => {
            state.fixes.cashPayment += action.payload.cashPayment;
            state.fixes.cardPayment += action.payload.cardPayment;
        },
        addAirtimeSale: (state, action) => {
            state.airtime += action.payload;
        },
        addSpend: (state,action) => {
            state.spend += action.payload;
        },
        addSales: (state, action) => {
            state.products = action.payload.products;
            state.fixes = action.payload.fixes;
            state.airtime = action.payload.airtime;
            state.spend = action.payload.spend;
            state.cashFund = action.payload.cashFund;
        },
    },
});

export const { addProductSale, addFixSale, addAirtimeSale, addSpend, addSales } = salesSlice.actions;

export default salesSlice.reducer;
