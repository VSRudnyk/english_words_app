import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authAPI = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://words-backend-eight.vercel.app/api',
    baseUrl: 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState, endpoint }) => {
      const authState = getState().auth;

      const token = authState?.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useRegisterMutation } = authAPI;
