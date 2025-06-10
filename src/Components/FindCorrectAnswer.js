import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { sampleSize, shuffle } from 'lodash';
import { RenderItem } from './RenderItem';
// import { useGetWordsQuery } from '../../redux/wordsAPi';
import { useWords } from '../hooks/useWords';
import { Loader } from './Loader';

export const FindCorrectAnswer = ({
  currentWord,
  chekChosenAnswer,
  disabled,
}) => {
  // const { data } = useGetWordsQuery();
  // const words = data?.data;

  const [suggestedWords, setSuggestedWords] = useState();
  const { words, readWords, isLoading } = useWords();

  useEffect(() => {
    readWords();
  }, []);

  useEffect(() => {
    createAndShuffle();
  }, [currentWord]);

  const createAndShuffle = () => {
    const intermediateArr = words.filter((item) => item != currentWord);
    const randomArr = sampleSize(intermediateArr, 2);
    randomArr.push(currentWord);
    setSuggestedWords(shuffle(randomArr));
  };

  if (isLoading) return <Loader />;

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={suggestedWords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RenderItem
            item={item}
            chekChosenAnswer={chekChosenAnswer}
            currentWord={currentWord}
            disabled={disabled}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
  },
});
