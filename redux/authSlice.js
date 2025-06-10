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
        if (payload.message == 'User already exists') {
          state.user = payload.user;
          state._id = payload.user._id;
          state.token = payload.user.token;
        } else {
          state.user = { ...payload };
          state._id = payload._id;
          state.token = payload.token;
        }
      }
    );
  },
  reducers: {},
});

export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
