import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { speak } from '../functions/tts';

const shuffleLetters = (letters) => {
  if (letters.length <= 1) return letters;

  // Исходное слово для сравнения
  const originalWord = [...letters];
  let shuffled = [...letters];

  // Перемешиваем пока порядок букв не будет отличаться от оригинала
  while (shuffled.join('') === originalWord.join('')) {
    shuffled.sort(() => Math.random() - 0.5);
  }

  return shuffled;
};

export const WordScramble = ({
  words,
  setResult,
  showResultPage,
  setNumberOfWord,
  setErrorAnswer,
  setWordsToUpdate,
}) => {
  const [currentWordInd, setCurrentWordInd] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [userAnswer, setUserAnswer] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const currentWord = words[currentWordInd];
  const { word, translation } = currentWord;

  useEffect(() => {
    // При изменении words сбрасываем индекс
    if (words.length > 0) {
      const currentWord = words[currentWordInd];
      // Разбиваем слово на части по пробелам и дефисам
      const wordParts = currentWord.word.toLowerCase().split(/\s+/);
      // Убираем пустые строки если они есть
      const cleanParts = wordParts.filter((part) => part.length > 0);
      // Получаем массив букв для каждой части
      const letters = cleanParts.map((part) => part.split('')).flat();

      // Используем новую функцию вместо простой сортировки
      setScrambledLetters(shuffleLetters(letters));
      setUserAnswer(new Array(letters.length).fill(''));
      setIsCorrect(null);
      setDisabled(false);
    }
  }, [words, currentWordInd]);

  const updateWordStats = (wordObj, type = 'correct') => {
    const updatedWord = { ...wordObj };
    if (type === 'correct') {
      updatedWord.correctAnswersCount =
        (updatedWord.correctAnswersCount || 0) + 1;
    } else {
      updatedWord.incorectAnswersCount =
        (updatedWord.incorectAnswersCount || 0) + 1;
    }
    setWordsToUpdate((prev) => {
      const exists = prev.find((w) => w._id === updatedWord._id);
      if (exists) {
        return prev.map((w) => (w._id === updatedWord._id ? updatedWord : w));
      }
      return [...prev, updatedWord];
    });
  };

  const handleLetterPress = (letter, index) => {
    if (disabled) return;

    const emptyIndex = userAnswer.findIndex((l) => l === '');
    if (emptyIndex === -1) return;

    const newAnswer = [...userAnswer];
    newAnswer[emptyIndex] = letter;
    setUserAnswer(newAnswer);

    const newScrambled = [...scrambledLetters];
    newScrambled[index] = '';
    setScrambledLetters(newScrambled);

    if (emptyIndex === userAnswer.length - 1) {
      const cleanWord = word.toLowerCase().replace(/\s+/g, '');
      const isWordCorrect = newAnswer.join('') === cleanWord;
      setIsCorrect(isWordCorrect);
      setDisabled(true);

      if (isWordCorrect) {
        setResult((prev) => prev + 1);
        updateWordStats(currentWord, 'correct');
      } else {
        setErrorAnswer((prev) => [...prev, currentWord]);
        updateWordStats(currentWord, 'incorrect');
      }
    }
  };

  const handleFilledLetterPress = (letter, index) => {
    if (disabled) return;

    // Возвращаем букву в конец массива scrambledLetters
    const newScrambled = [...scrambledLetters];
    const firstEmptyIndex = newScrambled.findIndex((l) => l === '');

    // Если есть пустые места, заполняем первое из них
    // Если нет - добавляем в конец массива
    if (firstEmptyIndex !== -1) {
      newScrambled[firstEmptyIndex] = letter;
    } else {
      newScrambled.push(letter);
    }

    setScrambledLetters(newScrambled);

    // Очищаем место в ответе
    const newAnswer = [...userAnswer];
    newAnswer[index] = '';
    setUserAnswer(newAnswer);
  };

  const handleNext = () => {
    if (currentWordInd >= words.length - 1) {
      showResultPage(words.length);
    } else {
      setCurrentWordInd((prev) => prev + 1);
      setDisabled(false);
      // Сбрасываем состояние
      setIsCorrect(null);
      setUserAnswer([]);
      setScrambledLetters([]); // Очищаем массив букв
    }
    setNumberOfWord((prev) => prev + 1);
  };

  const colorAnswer = (defaultColor) => {
    if (isCorrect) {
      return '#4fc87a';
    } else if (isCorrect === false) {
      return '#ff8a7a';
    } else {
      return defaultColor;
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            ...styles.wordContainer,
            borderColor: colorAnswer('#dadada'),
          }}
        >
          <Text
            style={{
              marginBottom: disabled ? 0 : 30,
              fontSize: disabled ? 30 : 24,
              fontWeight: disabled ? 'bold' : 'normal',
            }}
          >
            {disabled ? word : translation}
          </Text>
          {disabled && (
            <TouchableOpacity
              style={styles.speakButton}
              onPress={() => speak(word)}
            >
              <MaterialCommunityIcons
                name="volume-high"
                size={24}
                color="#4fc87a"
              />
            </TouchableOpacity>
          )}
          <View
            style={[styles.lettersContainer, { marginTop: disabled ? 10 : 0 }]}
          >
            {word
              .toLowerCase()
              .split(/\s+/)
              .map((part, partIndex, parts) => (
                <View key={partIndex} style={styles.wordPart}>
                  {userAnswer
                    .slice(
                      // Вычисляем начальный индекс для текущей части
                      parts.slice(0, partIndex).join('').length,
                      // Вычисляем конечный индекс
                      parts.slice(0, partIndex + 1).join('').length
                    )
                    .map((letter, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.letterBox,
                          {
                            backgroundColor:
                              isCorrect === null
                                ? '#fff'
                                : isCorrect
                                  ? '#4fc87a'
                                  : '#ff8a7a',
                          },
                        ]}
                        onPress={() =>
                          letter &&
                          !disabled &&
                          handleFilledLetterPress(
                            letter,
                            parts.slice(0, partIndex).join('').length + index
                          )
                        }
                        disabled={!letter || disabled}
                      >
                        <Text
                          style={{
                            ...styles.letterText,
                            color: isCorrect && '#ffffff',
                          }}
                        >
                          {letter}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              ))}
          </View>
          {disabled && (
            <Text
              style={{
                marginTop: 10,
                fontSize: 24,
                fontWeight: 'normal',
              }}
            >
              {disabled ? translation : word}
            </Text>
          )}
        </View>
        <View style={styles.scrambledContainer}>
          {scrambledLetters.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.scrambledLetter, { opacity: letter ? 1 : 0 }]}
              onPress={() => handleLetterPress(letter, index)}
              disabled={!letter || disabled}
            >
              <Text style={styles.scrambledLetterText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {disabled && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  wordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 6,
    marginBottom: 20,
    minHeight: 250,
  },
  lettersContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  letterBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#dadada',
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  letterText: {
    fontSize: 24,
  },
  scrambledContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '100%',
    paddingHorizontal: 10,
  },
  scrambledLetter: {
    width: 40,
    height: 40,
    backgroundColor: '#4fc87a',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  scrambledLetterText: {
    fontSize: 24,
    color: '#fff',
  },
  speakButton: {
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#4fc87a',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wordPart: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 5,
  },
});
