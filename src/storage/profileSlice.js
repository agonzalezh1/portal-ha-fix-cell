import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    grants: [],
    profile: 0,
};

export const profileSlice = createSlice({ name: 'profile', initialState,
    reducers: {
        addGrants: (state, action) => {
            state.grants = action.payload.grants;
            state.profile = action.payload.profile;
        },
    },
});

export const { addGrants } = profileSlice.actions;

export default profileSlice.reducer;
