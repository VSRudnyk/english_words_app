import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const wordsAPI = createApi({
  reducerPath: 'wordsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://words-backend-eight.vercel.app/api',
  }),
  tagTypes: ['Words'],
  endpoints: (builder) => ({
    getWords: builder.query({
      query: () => `/words`,
      providesTags: ['Words'],
    }),
    getRandomWords: builder.query({
      query: (limit) => `/words/random?limit=${limit}`,
      providesTags: ['Words'],
    }),
    getWordsWithMistakes: builder.query({
      query: () => `/words/mistakes`,
      providesTags: ['Words'],
    }),
    deleteWord: builder.mutation({
      query: (wordId) => ({
        url: `/words/${wordId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Words'],
    }),
    deleteWordFromMistakes: builder.mutation({
      query: (wordId) => ({
        url: `/words/mistakes/${wordId}`,
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
    addWordWithMistakes: builder.mutation({
      query: (body) => ({
        url: '/words/mistakes',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Words'],
    }),
    updateWord: builder.mutation({
      query: ({ word, translation, synonyms, id }) => ({
        url: `/words/${id}`,
        method: 'PUT',
        body: {
          word,
          translation,
          synonyms,
        },
      }),
      invalidatesTags: ['Words'],
    }),
  }),
});

export const {
  useGetWordsQuery,
  useGetRandomWordsQuery,
  useGetWordsWithMistakesQuery,
  useDeleteWordMutation,
  useAddWordMutation,
  useAddWordWithMistakesMutation,
  useUpdateWordMutation,
  useDeleteWordFromMistakesMutation,
} = wordsAPI;
