import { configureStore } from '@reduxjs/toolkit';
import { wordsAPI } from './wordsAPi';

export const store = configureStore({
  reducer: {
    [wordsAPI.reducerPath]: wordsAPI.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wordsAPI.middleware),
});
