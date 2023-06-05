import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import DropDown from 'react-native-paper-dropdown';
import { Provider } from 'react-native-paper';
import { RadioButton, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import { useGetWordsQuery } from '../../redux/wordsAPi';
import { Loader } from '../../src/Components/Loader';
import { useGetWordsWithMistakesQuery } from '../../redux/wordsAPi';
import { useDeleteWordFromMistakesMutation } from '../../redux/wordsAPi';

export const SelectionTaskScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { data: words, isSuccess, isFetching } = useGetWordsQuery();
  const {
    data,
    isFetching: loading,
    isSuccess: success,
    refetch,
  } = useGetWordsWithMistakesQuery();
  const [deleteWordFromMistaken] = useDeleteWordFromMistakesMutation();
  const [wordCount, setWordCount] = useState(2);
  const [value, setValue] = useState('all words');
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);

  const wordsWithMistakes = data?.data;

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, []);

  if (isFetching && loading) return <Loader />;

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
      {isSuccess && success && (
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
                {value === 'all words' ? (
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
                ) : (
                  <>
                    <Text style={styles.itemHeader}>
                      Common mistakes - {wordsWithMistakes.length}
                    </Text>
                    <FlatList
                      style={{
                        width: '100%',
                        height: '65%',
                        marginTop: 10,
                      }}
                      data={wordsWithMistakes}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                          <Text style={styles.itemText}>{item.word}</Text>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => deleteWordFromMistaken(item._id)}
                          >
                            <MaterialCommunityIcons
                              name="close-circle"
                              size={24}
                              color="#ff8a7a"
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    />
                  </>
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
    position: 'absolute',
    bottom: 10,
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
  itemContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#BDBDBD',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
  },
  itemHeader: {
    fontSize: 20,
    textAlign: 'center',
  },
});
