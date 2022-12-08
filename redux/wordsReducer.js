import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  words: [],
};

const persistConfig = {
  key: 'words',
  storage: AsyncStorage,
  whitelist: ['words'],
};

export const wordsSlice = createSlice({
  name: 'words',
  initialState,
  reducers: {
    addWord(state, action) {
      state.words.push(action.payload);
    },
    removeWord(state, action) {
      state.words = state.words.filter((item) => item.id !== action.payload);
    },
    updateWord(state, action) {
      return {
        ...state,
        words: state.words.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                word: action.payload.word,
                translation: action.payload.translation,
              }
            : item
        ),
      };
    },
  },
});

export const { addWord, removeWord, updateWord } = wordsSlice.actions;

export const persistedWordsReducer = persistReducer(
  persistConfig,
  wordsSlice.reducer
);
