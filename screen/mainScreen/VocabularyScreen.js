import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'lodash';
import { addWord, removeWord, updateWord } from '../../redux/wordsReducer';
import { getWords } from '../../redux/selector';
import { ucFirst } from '../../src/functions/ucFirst';

const initialState = {
  word: '',
  translation: '',
};

export const VocabularyScreen = () => {
  const words = useSelector(getWords);
  const dispatch = useDispatch();
  const [newWord, setNewWord] = useState(initialState);
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState('');

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
      dispatch(addWord({ ...newWord, id: uuidv4() }));
    } else if (action === 'Update') {
      dispatch(updateWord(newWord));
    } else if (action === 'Del') {
      dispatch(removeWord(newWord.id));
    }
    setNewWord(initialState);
  };

  return (
    <View style={styles.container}>
      {isEmpty(words) ? (
        <View style={styles.noDataFoundCont}>
          <Image
            style={styles.noDataFoundImg}
            source={require('../../image/no-data-found.png')}
          />
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => openModal('Update', item)}
                onLongPress={() => openModal('Del', item)}
              >
                <Text style={styles.itemText}>{ucFirst(item.word)}</Text>
                <Text style={styles.itemText}>{ucFirst(item.translation)}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {!modalVisible && (
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
      )}
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
                <Text>{`Delete "${ucFirst(newWord.word)}"?`}</Text>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder={'English'}
                    placeholderTextColor={'#BDBDBD'}
                    value={newWord.word}
                    onChangeText={(value) =>
                      setNewWord((prevState) => ({ ...prevState, word: value }))
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 40,
    marginBottom: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
    marginBottom: 16,
  },
  openModalBtn: {
    position: 'absolute',
    right: 0,
    bottom: -50,
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
