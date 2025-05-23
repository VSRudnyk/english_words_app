import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
// import { Dropdown } from 'react-native-paper-dropdown';
import { RadioButton, Text, Checkbox } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
// import { useGetWordsQuery } from '../../redux/wordsAPi';
// import { Loader } from '../../src/Components/Loader';
// import { useGetWordsWithMistakesQuery } from '../../redux/wordsAPi';
// import { useDeleteWordsFromMistakesMutation } from '../../redux/wordsAPi';
import { CustomDropdown } from '../../src/Components/CustomDropdown';

const countList = [
  { label: 'Last 20 added', value: 'last20' },
  { label: 'Top 20 incorrect', value: 'top20incorrect' },
  { label: 'Random 10 low progress', value: 'random10lowprogress' },
  { label: 'Random 20 low progress', value: 'random20lowprogress' },
  { label: 'Random 20 low progress', value: 'random20lowprogress' },
  { label: 'All', value: 'all' },
];

export const SelectionTaskScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  // const { data: words, isSuccess, isFetching } = useGetWordsQuery();
  // const {
  //   data,
  //   isFetching: loading,
  //   isSuccess: success,
  //   refetch,
  // } = useGetWordsWithMistakesQuery();
  // const [deleteWordsFromMistakes] = useDeleteWordsFromMistakesMutation();
  const [wordCount, setWordCount] = useState();
  // const [value, setValue] = useState('all words');
  const [practVar, setPractVar] = useState('translate words');
  // const [selectedWords, setSelectedWords] = useState([]);
  // const [visibleCheckBox, setVisibleCheckBox] = useState(false);

  // const wordsWithMistakes = data?.data;

  // useEffect(() => {
  //   if (isFocused) {
  //     refetch();
  //   }
  // }, []);

  // if (isFetching && loading) return <Loader />;

  // const handleCheckBoxToggle = (word) => {
  //   setSelectedWords((prevSelectedWords) => {
  //     if (prevSelectedWords.includes(word)) {
  //       return prevSelectedWords.filter((item) => item !== word);
  //     } else {
  //       return [...prevSelectedWords, word];
  //     }
  //   });
  // };

  // const handleBatchDelete = async () => {
  //   try {
  //     await deleteWordsFromMistakes(selectedWords);
  //     setSelectedWords([]);
  //     setVisibleCheckBox(false);
  //     refetch();
  //   } catch (error) {
  //     console.error('Error deleting words:', error);
  //   }
  // };

  // const handleCheckBoxClose = () => {
  //   setVisibleCheckBox(false);
  //   setSelectedWords([]);
  // };

  // const allWordsLength = words.data.length;

  return (
    <>
      {/* {isSuccess && success && ( */}
      <View style={styles.container}>
        <View style={styles.radioButtonContainer}>
          <Text style={styles.radioButtonHeader}>
            Choose what you want to practice:
          </Text>

          <View style={styles.radioButtonGroup}>
            {/* <RadioButton.Group
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
              </RadioButton.Group> */}

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

          {/* {value === 'all words' ? ( */}
          {/* <View style={styles.dropDownContainer}> */}
          <CustomDropdown
            value={wordCount}
            onChange={setWordCount}
            options={countList}
            label={'Choose what you want to practice:'}
            placeholder={'Choose what you want to practice:'}
          />
          {/* </View> */}
          {/* ) : (
              <View style={styles.mistakesContainer}>
                <Text style={styles.itemHeader}>
                  Common mistakes - {wordsWithMistakes.length}
                </Text>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={wordsWithMistakes}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onLongPress={() => setVisibleCheckBox(true)} // Долгое нажатие
                    >
                      <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.word}</Text>
                        <Text style={styles.itemText}>{item.translation}</Text>
                        {visibleCheckBox && (
                          <Checkbox
                            status={
                              selectedWords.includes(item._id)
                                ? 'checked'
                                : 'unchecked'
                            }
                            onPress={() => handleCheckBoxToggle(item._id)}
                            color="#4fc87a" // Цвет фона чекбокса
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )} */}
        </View>
        <View style={styles.buttonContainer}>
          {/* {visibleCheckBox && value === 'mistakes' ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={handleCheckBoxClose}
                >
                  <Text style={styles.btnText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={handleBatchDelete}
                  disabled={selectedWords.length === 0} // Блокируем кнопку, если ничего не выбрано
                >
                  <Text style={styles.btnText}>Delete Selected</Text>
                </TouchableOpacity>
              </View>
            ) : ( */}
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() =>
              navigation.navigate('Practice', {
                wordCount,
                practVar,
              })
            }
          >
            <Text style={styles.btnText}>Start</Text>
          </TouchableOpacity>
          {/* )} */}
        </View>
      </View>
      {/* )} */}
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
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBottom: 5,
    borderWidth: 2,
    borderColor: '#4fc87a',
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
    paddingTop: 10,
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownContainer: {
    marginTop: 20,
    outlineWidth: 1,
  },
  mistakesContainer: {
    height: 450,
  },
  buttonContainer: {
    width: '100%', // Контейнер занимает всю ширину родителя
    flexDirection: 'row', // Размещаем кнопки в строку
    justifyContent: 'space-between', // Равномерное распределение кнопок
    alignItems: 'center', // Выравнивание кнопок по центру
    marginBottom: 10,
  },
  startBtn: {
    flex: 1, // Кнопка занимает равное пространство
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#4fc87a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    flex: 1, // Кнопка занимает равное пространство
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#ff8a7a',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5, // Отступ между кнопками
  },
  closeBtn: {
    flex: 1, // Кнопка занимает равное пространство
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
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#BDBDBD',
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 16,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
  itemHeader: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
    marginTop: 15,
    marginBottom: 10,
  },
});
