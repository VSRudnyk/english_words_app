import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { isEmpty } from 'lodash';
import { ucFirst } from '../../src/functions/ucFirst';
import {
  useGetWordsQuery,
  useAddWordMutation,
  useUpdateWordMutation,
  useDeleteWordMutation,
} from '../../redux/wordsAPi';
import { NoDataFound } from '../../src/Components/NoDataFound';

const initialState = {
  word: '',
  translation: '',
};

export const VocabularyScreen = () => {
  const { data: words, isFetching, isSuccess } = useGetWordsQuery();
  const [addWord] = useAddWordMutation();
  const [updateWord] = useUpdateWordMutation();
  const [deleteWord] = useDeleteWordMutation();
  const [newWord, setNewWord] = useState(initialState);
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState('');
  const [filter, setFilter] = useState('');

  const openModal = (text, item) => {
    setAction(text);
    setModalVisible(!modalVisible);
    if (text === 'Update' || text === 'Del') {
      setNewWord(item);
    }
  };

  const closeModal = () => {
    setModalVisible(!modalVisible);
    setNewWord(initialState);
  };

  const handleSubmit = () => {
    setModalVisible(false);
    if (action === 'Add') {
      addWord({
        word: newWord.word.toLowerCase().trim(),
        translation: newWord.translation.toLowerCase().trim(),
      });
    } else if (action === 'Update') {
      updateWord({
        id: newWord._id,
        word: newWord.word.toLowerCase().trim(),
        translation: newWord.translation.toLowerCase().trim(),
      });
    } else if (action === 'Del') {
      deleteWord(newWord._id);
    }
    setNewWord(initialState);
  };

  const getVisibleWords = () => {
    const normalizedFilter = filter.toLowerCase();
    if (isSuccess) {
      return words.data.filter(
        ({ word, translation }) =>
          word.toLowerCase().includes(normalizedFilter) ||
          translation.toLowerCase().includes(normalizedFilter)
      );
    }
  };
  const visibleWords = getVisibleWords();

  return (
    <View style={styles.container}>
      {isFetching ? (
        <ActivityIndicator size="large" color="#4fc87a" />
      ) : (
        <>
          {isEmpty(words.data) ? (
            <NoDataFound />
          ) : (
            <FlatList
              style={{ width: '100%' }}
              data={visibleWords}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => openModal('Update', item)}
                    onLongPress={() => openModal('Del', item)}
                  >
                    <Text style={styles.itemText}>{ucFirst(item.word)}</Text>
                    <Text style={styles.itemText}>
                      {ucFirst(item.translation)}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <View style={styles.filterContainer}>
            <TextInput
              style={styles.filterInput}
              placeholder={'Find word'}
              placeholderTextColor={'#BDBDBD'}
              value={filter}
              onChangeText={(value) => setFilter(value)}
            />
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

          <View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {action === 'Del' ? (
                    <Text style={styles.modalTextDel}>{`Delete "${ucFirst(
                      newWord.word
                    )}"?`}</Text>
                  ) : (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder={'English'}
                        placeholderTextColor={'#BDBDBD'}
                        value={newWord.word}
                        onChangeText={(value) =>
                          setNewWord((prevState) => ({
                            ...prevState,
                            word: value,
                          }))
                        }
                      />
                      <TextInput
                        style={styles.input}
                        placeholder={'Translation'}
                        placeholderTextColor={'#BDBDBD'}
                        value={newWord.translation}
                        onChangeText={(value) =>
                          setNewWord((prevState) => ({
                            ...prevState,
                            translation: value,
                          }))
                        }
                      />
                    </>
                  )}
                  <TouchableOpacity
                    style={styles.submitBtn}
                    activeOpacity={0.8}
                    onPress={handleSubmit}
                    disabled={newWord.word === '' || newWord.translation === ''}
                  >
                    <Text style={styles.submitBtnText}>{action}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.closeModalBtn}
                    activeOpacity={0.8}
                    onPress={() => closeModal()}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={24}
                      color="#4fc87a"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </>
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
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 16,
  },
  filterContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  filterInput: {
    padding: 8,
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#000',
  },
  closeModalBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  centeredView: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    width: '90%',
    margin: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextDel: {
    marginBottom: 20,
    fontSize: 16,
  },
  input: {
    padding: 8,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8E8E8',
    marginBottom: 20,
  },
  submitBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#4fc87a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#fff',
  },
  noDataFoundCont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataFoundImg: {
    borderRadius: 8,
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
});
