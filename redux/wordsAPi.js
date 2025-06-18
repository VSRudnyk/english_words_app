import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wordsAPI = createApi({
  reducerPath: 'wordsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://words-backend-eight.vercel.app/api',
    // baseUrl: 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ['Words'],
  endpoints: (builder) => ({
    deleteWords: builder.mutation({
      query: (wordsIds) => ({
        url: `/words/bulk-delete`,
        method: 'DELETE',
        body: { ids: wordsIds },
      }),
      invalidatesTags: ['Words'],
    }),
    bulkUpdateWords: builder.mutation({
      query: (wordsArr) => ({
        url: '/words/bulk-update',
        method: 'PUT',
        body: wordsArr,
      }),
      invalidatesTags: ['Words'],
    }),
  }),
});

export const { useDeleteWordsMutation, useBulkUpdateWordsMutation } = wordsAPI;
