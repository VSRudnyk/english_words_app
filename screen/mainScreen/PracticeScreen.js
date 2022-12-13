import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { TranslateToEng } from '../../src/Components/TranslateToEng';
import { useGetWordsQuery } from '../../redux/wordsAPi';
import { getRandomArr } from '../../src/functions/getRandomArr';

export const PracticeScreen = () => {
  const { data: words } = useGetWordsQuery();
  const [wordsArr, setWordsArr] = useState(null);

  const getWordsArr = () => {
    const max = words.length;
    setWordsArr(getRandomArr(1, max, words));
  };

  useEffect(() => {
    getWordsArr();
  }, [words]);

  return (
    <View style={styles.container}>
      {wordsArr && (
        <TranslateToEng words={wordsArr} getWordsArr={getWordsArr} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 40,
    marginBottom: 20,
  },
});
