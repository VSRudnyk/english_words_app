import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wordsAPI = createApi({
  reducerPath: 'wordsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://6260337a53a42eaa0701a5d8.mockapi.io',
  }),
  tagTypes: ['Words'],
  endpoints: (builder) => ({
    getWords: builder.query({
      query: () => `/words`,
      providesTags: ['Words'],
    }),
    deleteWord: builder.mutation({
      query: (wordId) => ({
        url: `/words/${wordId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Words'],
    }),
    addWord: builder.mutation({
      query: (newWord) => ({
        url: '/words',
        method: 'POST',
        body: newWord,
      }),
      invalidatesTags: ['Words'],
    }),
    updateWord: builder.mutation({
      query: ({ word, translation, id }) => ({
        url: `/words/${id}`,
        method: 'PUT',
        body: {
          word,
          translation,
        },
      }),
      invalidatesTags: ['Words'],
    }),
  }),
});

export const {
  useGetWordsQuery,
  useDeleteWordMutation,
  useAddWordMutation,
  useUpdateWordMutation,
} = wordsAPI;
