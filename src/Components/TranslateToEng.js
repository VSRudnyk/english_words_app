import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const TranslateToEng = ({
  words,
  setResult,
  showResultPage,
  setNumberOfWord,
}) => {
  const [currentWordInd, setCurrentWordInd] = useState(0);
  const [answer, setAnswer] = useState('');
  const [chekAnswer, setCheckAnswer] = useState('');
  const [btnText, setBtnText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    textBtn();
  }, [answer, chekAnswer]);

  const btnAction = () => {
    if (btnText === "Don't know") {
      setCorrectAnswer(true);
      setCheckAnswer('Mistake');
      setDisabled(false);
    } else if (btnText === 'Next') {
      if (currentWordInd >= words.length - 1) {
        showResultPage(words.length);
      } else {
        setCurrentWordInd((prevInd) => prevInd + 1);
      }
      setNumberOfWord((prew) => prew + 1);
      setCheckAnswer('');
      setAnswer('');
      setCorrectAnswer(false);
      setDisabled(true);
    }
  };

  const checkUserAnswer = () => {
    if (answer.toLowerCase().trim() === words[currentWordInd].word) {
      setCheckAnswer('Ok');
      setResult((prew) => prew + 1);
    } else {
      setCheckAnswer('Mistake');
    }

    setBtnText('Next');
    setDisabled(false);
  };

  const colorAnswer = (defaultColor) => {
    if (chekAnswer === 'Ok') {
      return '#4fc87a';
    } else if (chekAnswer === 'Mistake') {
      return '#ff8a7a';
    } else {
      return defaultColor;
    }
  };

  const textBtn = () => {
    if (answer === '' && chekAnswer === '') {
      setBtnText("Don't know");
    } else if (chekAnswer === 'Mistake') {
      setBtnText('Next');
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.wordContainer,
          borderColor: colorAnswer('#dadada'),
        }}
      >
        {(correctAnswer || chekAnswer.length > 0) && (
          <Text style={styles.wordInEng}>{words[currentWordInd].word}</Text>
        )}
        <Text
          style={{
            fontSize: correctAnswer || chekAnswer.length > 0 ? 18 : 26,
          }}
        >
          {words[currentWordInd].translation}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={{
            ...styles.input,
            borderColor: colorAnswer('#dadada'),
            color: colorAnswer('#111'),
            width:
              chekAnswer === 'Ok' || chekAnswer === 'Mistake' ? '100%' : '88%',
          }}
          textAlign={'center'}
          selectTextOnFocus={disabled}
          editable={disabled}
          autoFocus={true}
          cursorColor={'#4fc87a'}
          placeholder={`Enter the translation (${
            words[currentWordInd].word.replace(/[^a-zа-яё]/gi, '').length
          } letters)`}
          placeholderTextColor={'#BDBDBD'}
          value={answer}
          onChangeText={(value) => setAnswer(value)}
        />
        <TouchableOpacity
          style={{
            display:
              chekAnswer === 'Ok' || chekAnswer === 'Mistake' ? 'none' : 'flex',
          }}
          activeOpacity={0.8}
          onPress={checkUserAnswer}
          disabled={!disabled}
        >
          <MaterialCommunityIcons
            name="arrow-right-box"
            size={50}
            color="#4fc87a"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={btnAction}
        style={{
          ...styles.btn,
          backgroundColor: btnText === "Don't know" ? 'transparent' : '#4fc87a',
          borderWidth: btnText === "Don't know" ? 2 : 0,
          borderColor: btnText === "Don't know" ? '#4fc87a' : 'transparent',
        }}
      >
        <Text
          style={{
            color: btnText === "Don't know" ? '#4fc87a' : '#fff',
            fontWeight: 'bold',
          }}
        >
          {btnText.toUpperCase()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    // height: '100%',
  },
  wordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 250,
    borderWidth: 2,
    borderRadius: 6,
  },
  wordInEng: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  btn: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    padding: 18,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4fc87a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
  },
  input: {
    height: 40,
    maxHeight: 100,
    padding: 10,
    margin: 'auto',
    borderWidth: 2,
    borderRadius: 6,
  },
});
