import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: 0,
    fixes: 0,
    airtime: 0,
};

export const salesSlice = createSlice({ name: 'sales', initialState,
    reducers: {
        addProductSale: (state, action) => {
            state.products += action.payload;
        },
        addFixSale: (state, action) => {
            state.fixes += action.payload;
        },
        addAirtimeSale: (state, action) => {
            state.airtime += action.payload;
        },
        restartSales: state => {
            state.products = 0;
            state.fixes = 0;
            state.airtime = 0;
        },
    },
});

export const { addProductSale, addFixSale, addAirtimeSale, restartSales} = salesSlice.actions;

export default salesSlice.reducer;
