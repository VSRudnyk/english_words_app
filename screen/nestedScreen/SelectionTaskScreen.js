import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useGetWordsQuery } from '../../redux/wordsAPi';
// import { useGetWordsWithMistakesQuery } from '../../redux/wordsAPi';
import { Loader } from '../../src/Components/Loader';

export const SelectionTaskScreen = ({ navigation }) => {
  const { data: words, isSuccess, isFetching } = useGetWordsQuery();
  // const { data: mistakes } = useGetWordsWithMistakesQuery();
  const [wordCount, setWordCount] = useState(10);

  if (isFetching) return <Loader />;

  const allWordsLength = words.data.length;
  return (
    <>
      {isSuccess && (
        <View style={styles.container}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={wordCount}
              onValueChange={(itemValue, itemIndex) => setWordCount(itemValue)}
              itemStyle={{
                backgroundColor: 'red',
                color: 'blue',
                fontSize: 17,
              }}
            >
              <Picker.Item label="10" value={10} />
              <Picker.Item label="20" value={20} />
              <Picker.Item label="30" value={30} />
              <Picker.Item label="All" value={allWordsLength} />
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => navigation.navigate('Practice', { wordCount })}
          >
            <Text style={styles.btnText}>Start</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    justifyContent: 'center',
    height: '100%',
  },
  pickerContainer: {
    marginTop: 25,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#4fc87a',
  },
  startBtn: {
    marginTop: 25,
    width: '100%',
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#4fc87a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
