import { useState, useEffect } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
  } from 'react-native';
  import { sampleSize, shuffle } from 'lodash';
  import { RenderItem } from './RenderItem';

export const FindCorrectAnswer = ({words, currentWord, chekChosenAnswer, disabled}) => {
 
    const [suggestedWords, setSuggestedWords] = useState();

    useEffect(() => {
      createAndShuffle();
    }, [currentWord])

    const createAndShuffle = () => {
      const intermediateArr = words.filter(item => item != currentWord);
      const randomArr = sampleSize(intermediateArr, 2);
      randomArr.push(currentWord);
      setSuggestedWords(shuffle(randomArr));
    }

    return (
    <View style={styles.listContainer}>   
      <FlatList
        data={suggestedWords}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RenderItem item={item} chekChosenAnswer={chekChosenAnswer} currentWord={currentWord} disabled={disabled}/>
        )}
      />
    </View>
    )

}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center'
  }
})