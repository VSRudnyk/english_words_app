import {
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
  Image,
} from 'react-native';
import { useState, useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { isEmpty } from 'lodash';
import { TranslateToEng } from '../../src/Components/TranslateToEng';
import { useGetWordsQuery } from '../../redux/wordsAPi';
import { getRandomArr } from '../../src/functions/getRandomArr';
import { ResultPage } from '../../src/Components/resultPage';

export const PracticeScreen = () => {
  const { width } = useWindowDimensions();
  const {
    data: { data: words },
  } = useGetWordsQuery();
  const [wordsArr, setWordsArr] = useState(null);
  const [result, setResult] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalWords, setTotalWords] = useState(0);
  const [numberOfWord, setNumberOfWord] = useState(1);

  useEffect(() => {
    getWordsArr();
  }, [words]);

  const getWordsArr = () => {
    const max = words.length;
    setWordsArr(getRandomArr(0, max, words));
  };

  const practiceMore = () => {
    getWordsArr();
    setShowResult(false);
    setResult(0);
    setNumberOfWord(1);
  };

  const showResultPage = (max) => {
    setShowResult(true);
    setTotalWords(max);
  };

  return (
    <View style={styles.container}>
      {isEmpty(words) ? (
        <View style={styles.noDataFoundCont}>
          <Image
            style={styles.noDataFoundImg}
            source={require('../../image/no-data-found.png')}
          />
        </View>
      ) : (
        <>
          {!showResult && wordsArr ? (
            <>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Translate the word</Text>
                <Text
                  style={styles.progressText}
                >{`${numberOfWord}/${wordsArr.length}`}</Text>
              </View>
              <Progress.Bar
                progress={(numberOfWord - 1) / wordsArr.length}
                width={width - 20}
                borderRadius={0}
                height={4}
                animated={false}
                unfilledColor={'#dadada'}
                color={'#4fc87a'}
                borderWidth={0}
              />

              <TranslateToEng
                words={wordsArr}
                setResult={setResult}
                showResultPage={showResultPage}
                setNumberOfWord={setNumberOfWord}
              />
            </>
          ) : (
            <ResultPage
              practiceMore={practiceMore}
              result={result}
              total={totalWords}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginHorizontal: 10,
    marginTop: 40,
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    color: '#111',
    fontSize: 16,
  },
  noDataFoundImg: {
    borderRadius: 8,
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
});
