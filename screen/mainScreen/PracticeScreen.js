import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { isEmpty } from 'lodash';
import { ProgressBar } from '../../src/Components/ProgressBar';
import { NoDataFound } from '../../src/Components/NoDataFound';
import { TranslateToEng } from '../../src/Components/TranslateToEng';
import { useGetRandomWordsQuery } from '../../redux/wordsAPi';
import { ResultPage } from '../../src/Components/ResultPage';

export const PracticeScreen = () => {
  const { data: words, isLoading, refetch } = useGetRandomWordsQuery(10);
  const [errorAnswer, setErrorAnswer] = useState([]);
  const [result, setResult] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [numberOfWord, setNumberOfWord] = useState(1);

  const practiceMore = () => {
    refetch();
    setShowResult(false);
    setResult(0);
    setNumberOfWord(1);
    setErrorAnswer([]);
  };

  const showResultPage = (max) => {
    setShowResult(true);
    setTotalWords(max);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4fc87a" />
      ) : (
        <>
          {isEmpty(words.data) ? (
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
                    words={words.data}
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 40,
    marginBottom: 60,
    // justifyContent: 'center',
    alignItems: 'center',
  },
});
