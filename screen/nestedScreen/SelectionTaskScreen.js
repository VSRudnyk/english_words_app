import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import DropDown from 'react-native-paper-dropdown';
import { Provider } from 'react-native-paper';
import { RadioButton, Text } from 'react-native-paper';
import { useGetWordsQuery } from '../../redux/wordsAPi';
import { Loader } from '../../src/Components/Loader';

export const SelectionTaskScreen = ({ navigation }) => {
  const { data: words, isSuccess, isFetching } = useGetWordsQuery();
  const [wordCount, setWordCount] = useState(2);
  const [value, setValue] = useState('all words');
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);

  if (isFetching) return <Loader />;

  const allWordsLength = words.data.length;

  const countList = [
    {
      label: '10',
      value: 10,
    },
    {
      label: '20',
      value: 20,
    },
    {
      label: 'All words',
      value: isSuccess && allWordsLength,
    },
  ];

  return (
    <>
      {isSuccess && (
        <>
          <Provider>
            <View style={styles.container}>
              <View style={styles.radioButtonContainer}>
                <Text style={styles.radioButtonHeader}>
                  Choose what you want to practice:
                </Text>
                <RadioButton.Group
                  onValueChange={(newValue) => setValue(newValue)}
                  value={value}
                >
                  <View>
                    <Text>All words</Text>
                    <RadioButton value="all words" color="#4fc87a" />
                  </View>
                  <View>
                    <Text>Mistakes</Text>
                    <RadioButton value="mistakes" color="#4fc87a" />
                  </View>
                </RadioButton.Group>
                {value === 'all words' && (
                  <View style={styles.dropDownContainer}>
                    <DropDown
                      label={'Choose the number of words to practice'}
                      mode={'outlined'}
                      visible={showMultiSelectDropDown}
                      showDropDown={() => setShowMultiSelectDropDown(true)}
                      onDismiss={() => setShowMultiSelectDropDown(false)}
                      value={wordCount}
                      setValue={setWordCount}
                      list={countList}
                      activeColor="#4fc87a"
                    />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() =>
                  navigation.navigate('Practice', { wordCount, value })
                }
              >
                <Text style={styles.btnText}>Start</Text>
              </TouchableOpacity>
            </View>
          </Provider>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    justifyContent: 'space-between',
    height: '100%',
  },
  radioButtonContainer: {
    marginTop: 25,
  },
  radioButtonHeader: {
    marginBottom: 10,
    fontSize: 18,
  },
  dropDownContainer: {
    marginTop: 50,
  },
  startBtn: {
    padding: 18,
    marginBottom: 10,
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
