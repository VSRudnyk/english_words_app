import Tts from 'react-native-tts';
import { tostify } from './toast';

export const speak = (text) => {
    try {
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
        Tts.speak(text, {
        androidParams: {
        KEY_PARAM_PAN: 0,
        KEY_PARAM_VOLUME: 1,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
    },
  });
    } catch (error) {
        tostify(
            'Error: ' + error.message,
            '#ff8a7a',
            '#fff'
        );
    }
 
}