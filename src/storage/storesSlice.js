import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stores: [],
    currentStore: '',
};

export const storesSlice = createSlice({ name: 'stores', initialState,
    reducers: {
        addStores: (state, action) => {
            state.stores = action.payload;
        },
        addCurrentStore: (state, action) => {
            state.currentStore = action.payload;
        },
    },
});

export const { addStores, addCurrentStore } = storesSlice.actions;

export default storesSlice.reducer;
