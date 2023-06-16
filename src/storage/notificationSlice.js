import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    type: 0,
    text: '',
    showNotification: false,
};

export const notificationSlice = createSlice({ name: 'notification', initialState,
    reducers: {
        showNotification: (state, action) => {
            state.text = action.payload.text;
            state.type = action.payload.type;
            state.showNotification = true;
        },
        hiddenNotification: (state, action) => {
            state.text = '';
            state.type = 0;
            state.showNotification = false;
        },
    },
});

export const { showNotification, hiddenNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
