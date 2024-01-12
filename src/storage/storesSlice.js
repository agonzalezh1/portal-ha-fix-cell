import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stores: [],
    currentStore: '',
    address: '',
    name: '',
};

export const storesSlice = createSlice({ name: 'stores', initialState,
    reducers: {
        addStores: (state, action) => {
            state.stores = action.payload;
        },
        addCurrentStore: (state, action) => {
            state.currentStore = action.payload;
        },
        addStoreInfo: (state, action) => {
            state.name = action.payload.name;
            state.address = action.payload.address;
        },
    },
});

export const { addStores, addCurrentStore, addStoreInfo } = storesSlice.actions;

export default storesSlice.reducer;
