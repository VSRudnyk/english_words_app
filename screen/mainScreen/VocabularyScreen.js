import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { isEmpty } from 'lodash';
import { ucFirst } from '../../src/functions/ucFirst';
import { useGetWordsQuery } from '../../redux/wordsAPi';
import { NoDataFound } from '../../src/Components/NoDataFound';
import { Loader } from '../../src/Components/Loader';
import { AppModal } from '../../src/Components/AppModal';

const initialState = {
  word: '',
  translation: '',
  synonyms: '',
};

export const VocabularyScreen = () => {
  const { data, isFetching, isSuccess } = useGetWordsQuery();
  const [newWord, setNewWord] = useState(initialState);
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState('');
  const [filter, setFilter] = useState('');

  const words = data?.data;

  const openModal = (text, item) => {
    setAction(text);
    setModalVisible(true);
    if (text === 'Update' || text === 'Delete') {
      setNewWord(item);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewWord(initialState);
  };

  const getVisibleWords = () => {
    const normalizedFilter = filter.toLowerCase();
    if (isSuccess) {
      return words?.filter(
        ({ word, translation }) =>
          word.toLowerCase().includes(normalizedFilter) ||
          translation.toLowerCase().includes(normalizedFilter)
      );
    }
  };
  const visibleWords = getVisibleWords();

  if (isFetching) return <Loader />;

  return (
    <View style={styles.container}>
      {isEmpty(words) ? (
        <NoDataFound />
      ) : (
        <>
          <Text style={styles.vacabularyHeader}>Total words in the vocabulary: { words.length }</Text>
          <FlatList
            style={{ width: '100%' }}
            data={visibleWords}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View>
                
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => openModal('Update', item)}
                >
                  <Text style={styles.itemText}>{ucFirst(item.word)}</Text>
                  <Text style={styles.itemText}>{ucFirst(item.translation)}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
      <View style={styles.bottomContainer}>
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder={'Find word'}
            placeholderTextColor={'#BDBDBD'}
            selectionColor={'#4fc87a'}
            value={filter}
            onChangeText={(value) => setFilter(value)}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 5 }}
            activeOpacity={0.8}
            onPress={() => setFilter('')}
          >
            <MaterialCommunityIcons
              name="backspace"
              size={24}
              color="#4fc87a"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.openModalBtn}
          activeOpacity={0.8}
          onPress={() => openModal('Add')}
        >
          <MaterialCommunityIcons
            name="plus-circle"
            size={48}
            color="#4fc87a"
          />
        </TouchableOpacity>
      </View>
      {modalVisible && (
        <AppModal
          words={words}
          newWord={newWord}
          setNewWord={setNewWord}
          action={action}
          closeModal={closeModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 40,
    marginBottom: 10,
  },
  vacabularyHeader: {
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    border: '2px solid #4fc87a',
    marginBottom: 4,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    padding: 10,
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  filterContainer: {
    flex: 1,
    width: '85%',
    justifyContent: 'center',
    marginRight: 10,
  },
  filterInput: {
    padding: 8,
    height: 40,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#4fc87a',
  },
});
