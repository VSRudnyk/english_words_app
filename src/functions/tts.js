import * as Speech from 'expo-speech';
import { tostify } from './toast';

export const speak = (text) => {
  try {
    Speech.speak(text, {
      language: 'en-GB',
      pitch: 1,
      rate: 1,
      volume: 1,
    });
  } catch (error) {
    tostify('Error: ' + error.message, '#ff8a7a', '#fff');
  }
};
