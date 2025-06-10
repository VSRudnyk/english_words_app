import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from './authAPI';

const initialState = {
  user: {},
  _id: null,
  isLoggedIn: false,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: (builder) => {
    builder.addMatcher(
      authAPI.endpoints.register.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state._id = payload.user._id;
        state.token = payload.user.token;
        state.isLoggedIn = true;
      }
    );
  },
  reducers: {},
});

export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
