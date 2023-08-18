import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    text: '',
};

export const spinnerSlice = createSlice({ name: 'spinner', initialState,
    reducers: {
        loadSpinner: (state, action) => {
            state.loading = action.payload.loading;
            state.text = action.payload.text;
        },
    },
});

export const { loadSpinner } = spinnerSlice.actions;

export default spinnerSlice.reducer;
