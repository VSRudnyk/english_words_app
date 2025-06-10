import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import { setupListeners } from '@reduxjs/toolkit/query';
import { wordsAPI } from './wordsAPi';
import { authAPI } from './authAPI';
import authReducer from './authSlice';
import { logger } from 'redux-logger';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', '_id', 'user'],
};

const persistedReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [wordsAPI.reducerPath]: wordsAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    wordsAPI.middleware,
    authAPI.middleware,
  ],
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
