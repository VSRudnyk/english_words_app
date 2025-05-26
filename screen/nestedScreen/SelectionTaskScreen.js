import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { RadioButton, Text } from 'react-native-paper';
import { CustomDropdown } from '../../src/Components/CustomDropdown';

const countList = [
  { label: 'Last 20 added', value: 'last20' },
  { label: 'Top 20 incorrect', value: 'top20incorrect' },
  { label: 'Random 10 low progress', value: 'random10lowprogress' },
  { label: 'Random 20 low progress', value: 'random20lowprogress' },
  { label: 'All', value: 'all' },
];

export const SelectionTaskScreen = ({ navigation }) => {
  const [wordCount, setWordCount] = useState();
  const [practVar, setPractVar] = useState('translate words');

  return (
    <View style={styles.container}>
      <View style={styles.radioButtonContainer}>
        <Text style={styles.radioButtonHeader}>
          Choose what you want to practice:
        </Text>

        <View style={styles.radioButtonGroup}>
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
              <RadioButton value="word scramble" color="#4fc87a" />
              <Text style={styles.textColor}>Word Scramble</Text>
            </View>
            <View style={styles.radioButtonItem}>
              <RadioButton value="random selection" color="#4fc87a" />
              <Text style={styles.textColor}>Random selection</Text>
            </View>
          </RadioButton.Group>
        </View>
        <CustomDropdown
          value={wordCount}
          onChange={setWordCount}
          options={countList}
          label={'Choose what you want to practice:'}
          placeholder={'Choose what you want to practice:'}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{
            ...styles.startBtn,
            backgroundColor: !wordCount ? '#ccc' : '#4fc87a',
          }}
          disabled={!wordCount}
          onPress={() =>
            navigation.navigate('Practice', {
              wordCount,
              practVar,
            })
          }
        >
          <Text style={styles.btnText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
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
