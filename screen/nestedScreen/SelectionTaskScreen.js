import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-paper-dropdown';
import { Provider as PaperProvider, RadioButton, Text, DefaultTheme } from 'react-native-paper';
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
  const [practVar, setPractVar] = useState('translate words');

  const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff', // Белый фон
    surface: '#ffffff',    // Белый фон для компонентов
    text: '#000000',       // Чёрный текст
    primary: '#4fc87a',    // Основной цвет
    accent: '#4fc87a',     // Акцентный цвет
  },
};

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
          <PaperProvider theme={lightTheme}>
            <View style={styles.container}>
              <View style={styles.radioButtonContainer}>
                <Text style={styles.radioButtonHeader}>
                  Choose what you want to practice:
                </Text>

                <View style={styles.radioButtonGroup}>
                  <RadioButton.Group
                    onValueChange={(newValue) => setValue(newValue)}
                    value={value}
                  >
                    <View style={styles.radioButtonItem}>
                      <Text style={styles.textColor}>All words</Text>
                      <RadioButton value="all words" color="#4fc87a" />
                    </View>
                    <View style={styles.radioButtonItem}>
                      <Text style={styles.textColor}>Mistakes</Text>
                      <RadioButton value="mistakes" color="#4fc87a" />
                    </View>
                  </RadioButton.Group>

                  <RadioButton.Group
                    onValueChange={(newValue) => setPractVar(newValue)}
                    value={practVar}
                  >
                    <View style={styles.radioButtonItem}>
                      <RadioButton value="translate words" color="#4fc87a" />
                      <Text style={styles.textColor}>Translate words</Text>
                    </View>
                    <View style={styles.radioButtonItem}>
                      <RadioButton value="find answer" color="#4fc87a" />
                      <Text style={styles.textColor}>Find answer</Text>
                    </View>
                    <View style={styles.radioButtonItem}>
                      <RadioButton value="random selection" color="#4fc87a" />
                      <Text style={styles.textColor}>Random selection</Text>
                    </View>
                  </RadioButton.Group>
                </View>

                {value === 'all words' ? (
                  <View style={styles.dropDownContainer}>
                    <Dropdown
                      placeholder={'Choose the number of words to practice'}
                      options={countList}
                      hideMenuHeader={true}
                      mode={'outlined'}
                      value={wordCount}
                      onSelect={setWordCount}
                      textInputStyle={{
                        backgroundColor: '#fff',
                        color: '#000',
                      }}
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
                  navigation.navigate('Practice', {
                    wordCount,
                    value,
                    practVar,
                  })
                }
              >
                <Text style={styles.btnText}>Start</Text>
              </TouchableOpacity>
            </View>
          </PaperProvider>
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
  radioButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioButtonHeader: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownContainer: {
    marginTop: 50,
    backgroundColor: '#fff',
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
  textColor: {
    color: '#000',
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
    color: '#000',
  },
  itemHeader: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
});
