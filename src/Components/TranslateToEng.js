import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AnswerInput } from './AnswerInput';
import { FindCorrectAnswer } from './FindCorrectAnswer';

export const TranslateToEng = ({
  words,
  setResult,
  showResultPage,
  setNumberOfWord,
  setErrorAnswer,
  setCorrectMistakes,
}) => {
  const [currentWordInd, setCurrentWordInd] = useState(0);
  const [answer, setAnswer] = useState('');
  const [chekAnswer, setCheckAnswer] = useState('');
  const [btnText, setBtnText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [visibleComponent, setVisibleComponent] = useState(false);

  useEffect(() => {
    textBtn();
  }, [answer, chekAnswer]);

  const currentWord = words[currentWordInd];
  const {word, synonyms, translation} = currentWord;

  const randomBoolean = () => {
    const number = Math.random();
    if(number < 0.5) {
      setVisibleComponent(false);
    } else {
      setVisibleComponent(true);
    }
  }

  const btnAction = () => {
    if (btnText === "Don't know") {
      setNumberOfWord((prew) => prew + 1);
      setErrorAnswer((prew) => [...prew, currentWord]);
      setCorrectAnswer(true);
      setCheckAnswer('Mistake');
      setDisabled(true);
    } else if (btnText === 'Next') {
      if (currentWordInd >= words.length - 1) {
        showResultPage(words.length);
      } else {
        setCurrentWordInd((prevInd) => prevInd + 1);
      }

      setCheckAnswer('');
      setAnswer('');
      setCorrectAnswer(false);
      setDisabled(false);
      randomBoolean();
    }
  };

  const checkUserAnswer = (x) => {
    if (answer.toLowerCase().trim() === word || x === word) {
      setCheckAnswer('Ok');
      setResult((prew) => prew + 1);
      setCorrectMistakes((prew) => [...prew, currentWord]);
    } 
    else if (
      visibleComponent && synonyms.includes(answer.toLowerCase().trim())
    ) {
      setCheckAnswer('Ok');
      setResult((prew) => prew + 1);
      setCorrectMistakes((prew) => [...prew, currentWord]);
    }
     else {
      setCheckAnswer('Mistake');
      setErrorAnswer((prew) => [...prew, currentWord]);
    }
    setNumberOfWord((prew) => prew + 1);
    setBtnText('Next');
    setDisabled(true);
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
          <>
            <Text style={styles.wordInEng}>{visibleComponent ? word : translation}</Text>
            {synonyms && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                }}
              >
                <Text style={{ marginRight: 10, fontSize: 16 }}>Synonym:</Text>
                <Text style={{ fontSize: 16 }}>
                  {synonyms}
                </Text>
              </View>
            )}
          </>
        )}
        <Text
          style={{
            fontSize: correctAnswer || chekAnswer.length > 0 ? 24 : 30,
          }}
        >
          {visibleComponent ? translation : word}
        </Text>
      </View>
      {visibleComponent ? 
      <AnswerInput inputColor={colorAnswer} chekAnswer={chekAnswer} disabled={disabled} word={word} answer={answer} setAnswer={setAnswer} checkBtn={checkUserAnswer}/> : 
      <FindCorrectAnswer words={words} currentWord={currentWord} chekChosenAnswer={checkUserAnswer} disabled={disabled}/>
      }

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
    width: '100%',
  },
  wordContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    borderWidth: 2,
    borderRadius: 6,
  },
  wordInEng: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  btn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 18,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4fc87a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
