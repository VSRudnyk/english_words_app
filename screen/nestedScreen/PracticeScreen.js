import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { ProgressBar } from '../../src/Components/ProgressBar';
import { NoDataFound } from '../../src/Components/NoDataFound';
import { TranslateToEng } from '../../src/Components/TranslateToEng';
import { ResultPage } from '../../src/Components/resultPage';
import { Loader } from '../../src/Components/Loader';
import {
  useBulkUpdateWordsMutation,
  useGetWordsQuery,
} from '../../redux/wordsAPi';

export const PracticeScreen = ({ route, navigation }) => {
  const { wordCount, practVar } = route.params;

  const [errorAnswer, setErrorAnswer] = useState([]);
  const [result, setResult] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [numberOfWord, setNumberOfWord] = useState(1);
  const [wordsToUpdate, setWordsToUpdate] = useState([]);
  const [practiceWords, setPracticeWords] = useState([]);

  const { data, isFetching, isLoading } = useGetWordsQuery();
  const words = data?.data;

  const [bulkUpdateWords, { isLoading: isUpdating }] =
    useBulkUpdateWordsMutation();

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
        return [...words]
          .sort(
            (a, b) =>
              (a.correctAnswersCount || 0) +
              (a.incorectAnswersCount || 0) -
              ((b.correctAnswersCount || 0) + (b.incorectAnswersCount || 0))
          )
          .slice(0, words.length)
          .sort(() => Math.random() - 0.5)
          .slice(0, 10);
      case 'random20lowprogress':
        return [...words]
          .sort(
            (a, b) =>
              (a.correctAnswersCount || 0) +
              (a.incorectAnswersCount || 0) -
              ((b.correctAnswersCount || 0) + (b.incorectAnswersCount || 0))
          )
          .slice(0, words.length)
          .sort(() => Math.random() - 0.5)
          .slice(0, 20);
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

  useEffect(() => {
    setPracticeWords(selectPracticeWords(words, wordCount));
  }, [words, wordCount]);

  const resetPage = async () => {
    if (!isEmpty(wordsToUpdate)) {
      try {
        await bulkUpdateWords(wordsToUpdate).unwrap();
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

  if (isLoading || isFetching || isUpdating) return <Loader />;

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
        numberOfAllWord={practiceWords.length} // количество слов для практики
      />
      <TranslateToEng
        words={practiceWords} // массив слов для практики
        practiceVariant={practVar}
        setResult={setResult}
        showResultPage={showResultPage}
        setNumberOfWord={setNumberOfWord}
        setErrorAnswer={setErrorAnswer}
        setWordsToUpdate={setWordsToUpdate}
      />
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
