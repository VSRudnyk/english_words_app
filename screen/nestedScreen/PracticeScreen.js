import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { ProgressBar } from '../../src/Components/ProgressBar';
import { NoDataFound } from '../../src/Components/NoDataFound';
import { TranslateToEng } from '../../src/Components/TranslateToEng';
import { ResultPage } from '../../src/Components/resultPage';
import { WordScramble } from '../../src/Components/WordScramble';
import { Loader } from '../../src/Components/Loader';
import { useWords } from '../../src/hooks/useWords';

export const PracticeScreen = ({ route, navigation }) => {
  const { wordCount, practVar } = route.params;

  const [errorAnswer, setErrorAnswer] = useState([]);
  const [result, setResult] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [numberOfWord, setNumberOfWord] = useState(1);
  const [wordsToUpdate, setWordsToUpdate] = useState([]);
  const [practiceWords, setPracticeWords] = useState([]);

  const { words, isLoading, readWords, updateWordStats } = useWords();

  useEffect(() => {
    readWords();
  }, []);

  useEffect(() => {
    setPracticeWords(selectPracticeWords(words, wordCount));
  }, [words, wordCount]);

  const selectPracticeWords = () => {
    if (!Array.isArray(words)) return [];

    switch (wordCount) {
      case 'last20':
        return [...words]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 20);
      case 'top20incorrect':
        return [...words]
          .sort((a, b) => {
            const aTotal =
              (a.correctAnswersCount || 0) + (a.incorectAnswersCount || 0);
            const bTotal =
              (b.correctAnswersCount || 0) + (b.incorectAnswersCount || 0);
            const aPercent = aTotal
              ? (a.incorectAnswersCount || 0) / aTotal
              : 0;
            const bPercent = bTotal
              ? (b.incorectAnswersCount || 0) / bTotal
              : 0;
            return bPercent - aPercent;
          })
          .slice(0, 20);
      case 'random10lowprogress':
        const unpracticedWords10 = words.filter(
          (word) =>
            (!word.correctAnswersCount || word.correctAnswersCount === 0) &&
            (!word.incorectAnswersCount || word.incorectAnswersCount === 0)
        );

        if (unpracticedWords10.length >= 10) {
          return [...unpracticedWords10]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        }

        const practicedWords10 = words
          .filter(
            (word) =>
              word.correctAnswersCount > 0 || word.incorectAnswersCount > 0
          )
          .sort(
            (a, b) =>
              (a.correctAnswersCount || 0) +
              (a.incorectAnswersCount || 0) -
              ((b.correctAnswersCount || 0) + (b.incorectAnswersCount || 0))
          );

        return [...unpracticedWords10, ...practicedWords10]
          .slice(0, 10)
          .sort(() => Math.random() - 0.5);
      case 'random20lowprogress':
        const unpracticedWords20 = words.filter(
          (word) =>
            (!word.correctAnswersCount || word.correctAnswersCount === 0) &&
            (!word.incorectAnswersCount || word.incorectAnswersCount === 0)
        );

        if (unpracticedWords20.length >= 20) {
          return [...unpracticedWords20]
            .sort(() => Math.random() - 0.5)
            .slice(0, 20);
        }

        const practicedWords20 = words
          .filter(
            (word) =>
              word.correctAnswersCount > 0 || word.incorectAnswersCount > 0
          )
          .sort(
            (a, b) =>
              (a.correctAnswersCount || 0) +
              (a.incorectAnswersCount || 0) -
              ((b.correctAnswersCount || 0) + (b.incorectAnswersCount || 0))
          );

        return [...unpracticedWords20, ...practicedWords20]
          .slice(0, 20)
          .sort(() => Math.random() - 0.5);
      default:
        if (!isNaN(Number(wordCount))) {
          return [...words]
            .sort(() => Math.random() - 0.5)
            .slice(0, Number(wordCount));
        } else if (wordCount === 'all') {
          return [...words].sort(() => Math.random() - 0.5);
        }
        return [];
    }
  };

  const resetPage = async () => {
    if (!isEmpty(wordsToUpdate)) {
      try {
        await updateWordStats(wordsToUpdate);
      } catch (error) {
        console.error('Error updating words:', error);
      }
    }
    setShowResult(false);
    setResult(0);
    setNumberOfWord(1);
    setErrorAnswer([]);
    setWordsToUpdate([]);
  };

  const practiceMore = async () => {
    await resetPage();
    refetch();
  };

  const finishPractice = async () => {
    await resetPage();
    navigation.navigate('SelectionTaskScreen');
  };

  const showResultPage = (max) => {
    setShowResult(true);
    setTotalWords(max);
  };

  if (isLoading) return <Loader />;

  if (isEmpty(practiceWords)) return <NoDataFound />;

  if (showResult)
    return (
      <ResultPage
        practiceMore={practiceMore}
        result={result}
        total={totalWords}
        errorAnswer={errorAnswer}
        finish={finishPractice}
      />
    );

  return (
    <View style={styles.container}>
      <ProgressBar
        numberOfWord={numberOfWord}
        numberOfAllWord={practiceWords.length}
      />
      {practVar === 'word scramble' ? (
        <WordScramble
          words={practiceWords}
          setResult={setResult}
          showResultPage={showResultPage}
          setNumberOfWord={setNumberOfWord}
          setErrorAnswer={setErrorAnswer}
          setWordsToUpdate={setWordsToUpdate}
        />
      ) : (
        <TranslateToEng
          words={practiceWords}
          practiceVariant={practVar}
          setResult={setResult}
          showResultPage={showResultPage}
          setNumberOfWord={setNumberOfWord}
          setErrorAnswer={setErrorAnswer}
          setWordsToUpdate={setWordsToUpdate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
