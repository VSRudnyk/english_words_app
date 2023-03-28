import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    View,
  } from 'react-native';
  import { sampleSize, shuffle } from 'lodash';
  import { ucFirst } from '../functions/ucFirst';


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
          <TouchableOpacity
              style={styles.button}
              disabled={disabled}
              onPress={() => chekChosenAnswer(item.word)}
            >
              <Text style={styles.text}>{ucFirst(item.translation)}</Text>
            </TouchableOpacity>
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
  },
  button: {
    padding: 18,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dadada',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  text: {
    fontSize: 18
  }
})