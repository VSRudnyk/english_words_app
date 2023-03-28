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
import { useDeleteWordFromMistakesMutation } from '../../redux/wordsAPi';

export const PracticeScreen = ({ route }) => {
  const { wordCount, value } = route.params;

  const trainMistakes = value === 'mistakes';

  const [errorAnswer, setErrorAnswer] = useState([]);
  const [correctMistakes, setCorrectMistakes] = useState([]);
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
  const [addWordWithMistakes, {isSuccess: addSuccess}] = useAddWordWithMistakesMutation();
  const [deleteWordFromMistaken, {isSuccess: delSuccess}] = useDeleteWordFromMistakesMutation();
  const { data: mistakes } = useGetWordsWithMistakesQuery();
  
  const resetPage = async () => {
    if (!isEmpty(errorAnswer)) {
      const a = await addWordWithMistakes(errorAnswer);
    }
    if (!isEmpty(correctMistakes)) {
      const d = await deleteWordFromMistaken(correctMistakes);
    }
    setShowResult(false);
    setResult(0);
    setNumberOfWord(1);
    setErrorAnswer([]);
    setCorrectMistakes([]);
  };

  const practiceMore = async () => {
    await resetPage();
    refetch();
  };

  const showResultPage = (max) => {
    setShowResult(true);
    setTotalWords(max);
  };

  if (isLoading || isFetching) return <Loader />;

  if (isEmpty(trainMistakes ? mistakes?.data : words?.data))
    return <NoDataFound />;

  if (showResult)
    return (
      <ResultPage
        practiceMore={practiceMore}
        result={result}
        total={totalWords}
        errorAnswer={errorAnswer}
      />
    );

  return (
    <View style={styles.container}>
      <ProgressBar
        numberOfWord={numberOfWord}
        numberOfAllWord={
          trainMistakes ? mistakes?.data.length : words?.data.length
        }
      />
      <TranslateToEng
        words={trainMistakes ? mistakes?.data : words?.data}
        setResult={setResult}
        showResultPage={showResultPage}
        setNumberOfWord={setNumberOfWord}
        setErrorAnswer={setErrorAnswer}
        setCorrectMistakes={setCorrectMistakes}
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
