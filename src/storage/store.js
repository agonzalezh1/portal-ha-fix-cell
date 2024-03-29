import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import notificationReducer from './notificationSlice';
import storesReducer from './storesSlice';
import salesReducer from './salesSlice';
import spinnerReducer from './spinnerSlice';

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        notification: notificationReducer,
        stores: storesReducer,
        sales: salesReducer,
        spinner: spinnerReducer,
    },
});
