import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sampleSize, shuffle } from 'lodash';
import { RenderItem } from './RenderItem';
import { useWords } from '../hooks/useWords';
import { Loader } from './Loader';

export const FindCorrectAnswer = ({
  currentWord,
  chekChosenAnswer,
  disabled,
}) => {
  const [suggestedWords, setSuggestedWords] = useState();
  const { words, readWords, isLoading } = useWords();
  const navigation = useNavigation();

  useEffect(() => {
    readWords();
  }, []);

  useEffect(() => {
    if (words?.length > 0 && currentWord) {
      createAndShuffle();
    }
  }, [words, currentWord]);

  const createAndShuffle = () => {
    const uniqueWords = words.filter(
      (item) =>
        item.id !== currentWord.id &&
        item.translation !== currentWord.translation
    );

    if (uniqueWords.length < 2) {
      Alert.alert(
        'Not enough words',
        'You need at least 3 different words in your vocabulary for this practice',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }

    const randomArr = sampleSize(uniqueWords, 2);
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
