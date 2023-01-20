import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { isEmpty } from 'lodash';
import { ProgressBar } from '../../src/Components/ProgressBar';
import { NoDataFound } from '../../src/Components/NoDataFound';
import { TranslateToEng } from '../../src/Components/TranslateToEng';
import { useGetRandomWordsQuery } from '../../redux/wordsAPi';
import { ResultPage } from '../../src/Components/ResultPage';
import { Loader } from '../../src/Components/Loader';
import { useAddWordWithMistakesMutation } from '../../redux/wordsAPi';
import { useGetWordsWithMistakesQuery } from '../../redux/wordsAPi';

export const PracticeScreen = ({ route }) => {
  const { wordCount, trainMistakes } = route.params;

  const [errorAnswer, setErrorAnswer] = useState([]);
  const [result, setResult] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [numberOfWord, setNumberOfWord] = useState(1);

  const {
    data: words,
    isFetching,
    isLoading,
    refetch,
  } = useGetRandomWordsQuery(wordCount);
  const [addWordWithMistakes] = useAddWordWithMistakesMutation();

  const {
    data: mistakes,
    isFetching: fetching,
    isLoading: loading,
  } = useGetWordsWithMistakesQuery();

  const resetPage = () => {
    addWordWithMistakes(errorAnswer);
    setShowResult(false);
    setResult(0);
    setNumberOfWord(1);
    setErrorAnswer([]);
  };

  const practiceMore = () => {
    resetPage();
    refetch();
  };

  const showResultPage = (max) => {
    setShowResult(true);
    setTotalWords(max);
  };

  if (isFetching || isLoading) return <Loader />;
  if (fetching || loading) return <Loader />;
  return (
    <View style={styles.container}>
      <>
        {isEmpty(words.data || mistakes.data) ? (
          <NoDataFound />
        ) : (
          <>
            {!showResult ? (
              <>
                <ProgressBar
                  numberOfWord={numberOfWord}
                  numberOfAllWord={words.data.length}
                />
                <TranslateToEng
                  words={trainMistakes ? mistakes.data : words.data}
                  setResult={setResult}
                  showResultPage={showResultPage}
                  setNumberOfWord={setNumberOfWord}
                  setErrorAnswer={setErrorAnswer}
                />
              </>
            ) : (
              <ResultPage
                practiceMore={practiceMore}
                result={result}
                total={totalWords}
                errorAnswer={errorAnswer}
              />
            )}
          </>
        )}
      </>
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
