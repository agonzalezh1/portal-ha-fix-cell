import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stores: [],
    currentStore: '',
    contactInfo: {
        address: '',
        whatsapp: '',
        phone: '',
    },
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
            state.contactInfo.address = action.payload.contactInfo.address;
            state.contactInfo.whatsapp = action.payload.contactInfo.whatsapp;
            state.contactInfo.phone = action.payload.contactInfo.phone;
        },
    },
});

export const { addStores, addCurrentStore, addStoreInfo } = storesSlice.actions;

export default storesSlice.reducer;
