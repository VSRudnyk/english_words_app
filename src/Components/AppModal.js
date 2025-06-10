import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';
import { useState, useEffect } from 'react';
import { tostify } from '../functions/toast';
// import {
//   useAddWordMutation,
//   useUpdateWordMutation,
//   useDeleteWordMutation,
// } from '../../redux/wordsAPi';
import { speak } from '../functions/tts';
import { useWords } from '../hooks/useWords';
import { useAuth } from '../hooks/useAuth';

const windowWidth = Dimensions.get('window').width;
const btnWidth = (windowWidth - 15) / 2;

export const AppModal = ({
  // words,
  closeModal,
  action,
  newWord,
  setNewWord,
}) => {
  const [userId, setUserId] = useState(null);
  const { words, addWord, updateWord, deleteWord, writeDeletedWordId } =
    useWords();
  const { getUserId } = useAuth();
  // const [updateWord] = useUpdateWordMutation();
  // const [deleteWord] = useDeleteWordMutation();

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };

    fetchUserId();
  }, []);

  const normalizeWord = newWord.word.toLowerCase().trim();
  const normalizeTranslation = newWord.translation.toLowerCase().trim();
  const normalizeSynonyms = newWord.synonyms.toLowerCase().trim();

  const handleSubmit = async () => {
    if (action === 'Add') {
      // Проверка на дубликаты
      for (const word of words) {
        if (word.translation === normalizeTranslation) {
          tostify('This word is already in the vocabulary', '#ff8a7a', '#fff');
          closeModal();
          return;
        }
      }

      const newWordObject = {
        id: uuid.v4(),
        owner: userId,
        word: normalizeWord,
        translation: normalizeTranslation,
        synonyms: normalizeSynonyms,
        createdAt: new Date().toISOString(),
        correctAnswersCount: 0,
        incorectAnswersCount: 0,
        pendingSync: true,
      };

      const success = await addWord(newWordObject);
      if (success) {
        tostify(
          `The word "${normalizeWord}" was added successfully`,
          '#4fc87a',
          '#fff'
        );
        closeModal();
      }
    } else if (action === 'Update') {
      const updatedWord = {
        id: newWord.id,
        owner: newWord.owner,
        word: normalizeWord,
        translation: normalizeTranslation,
        synonyms: normalizeSynonyms,
        createdAt: newWord.createdAt,
        updatedAt: new Date().toISOString(),
        correctAnswersCount: newWord.correctAnswersCount || 0,
        incorectAnswersCount: newWord.incorectAnswersCount || 0,
        pendingSync: true,
      };

      const success = await updateWord(updatedWord);
      if (success) {
        tostify(
          `The word "${normalizeWord}" was updated successfully`,
          '#4fc87a',
          '#fff'
        );
      }
    }
    closeModal();
  };

  const deleteCurrentWord = async () => {
    try {
      // First, add word ID to deletedWords array in storage
      if (!newWord.pendingSync) {
        await writeDeletedWordId(newWord.id);
      }

      // Then delete from local storage
      const success = await deleteWord(newWord.id);
      if (success) {
        tostify(
          `The word "${normalizeWord}" was deleted successfully`,
          '#4fc87a',
          '#fff'
        );
      }

      closeModal();
    } catch (error) {
      console.error('Error deleting word:', error);
      tostify('Error deleting word', '#ff8a7a', '#fff');
    }
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          closeModal();
        }}
      >
        <View style={styles.centeredView} z>
          <View style={styles.modalView}>
            <TextInput
              style={
                action === 'Add'
                  ? styles.input
                  : {
                      ...styles.inputCard,
                      fontSize: 26,
                      fontWeight: 'bold',
                      marginBottom: 15,
                    }
              }
              textAlign={'center'}
              placeholder={'English'}
              placeholderTextColor={'#BDBDBD'}
              selectionColor={'#4fc87a'}
              value={newWord.word}
              onChangeText={(value) =>
                setNewWord((prevState) => ({
                  ...prevState,
                  word: value,
                }))
              }
            />
            {action != 'Add' && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => speak(normalizeWord)}
              >
                <MaterialCommunityIcons
                  name="volume-high"
                  size={32}
                  color="#ffffff"
                />
              </TouchableOpacity>
            )}
            <TextInput
              style={action === 'Add' ? styles.input : styles.inputCard}
              textAlign={'center'}
              placeholder={'Translation'}
              placeholderTextColor={'#BDBDBD'}
              selectionColor={'#4fc87a'}
              value={newWord.translation}
              onChangeText={(value) =>
                setNewWord((prevState) => ({
                  ...prevState,
                  translation: value,
                }))
              }
            />
            <View
              style={
                action === 'Update'
                  ? {
                      width: '100%',
                      marginTop: 25,
                      marginBottom: 25,
                    }
                  : { width: '100%' }
              }
            >
              <Text style={{ fontSize: 14, color: 'white' }}>Synonyms:</Text>
              <TextInput
                style={action === 'Add' ? styles.input : styles.inputCard}
                textAlign={'left'}
                placeholder={'Add synonyms here'}
                placeholderTextColor={'#BDBDBD'}
                selectionColor={'#4fc87a'}
                value={newWord.synonyms}
                onChangeText={(value) =>
                  setNewWord((prevState) => ({
                    ...prevState,
                    synonyms: value,
                  }))
                }
              />
            </View>
            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginVertical: -(15 / 2),
                marginHorizontal: -(15 / 2),
              }}
            >
              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.8}
                onPress={handleSubmit}
                disabled={newWord.word === '' || newWord.translation === ''}
              >
                <Text style={styles.submitBtnText}>{action}</Text>
              </TouchableOpacity>

              {action === 'Update' && (
                <TouchableOpacity
                  style={{ ...styles.submitBtn, backgroundColor: '#ff8a7a' }}
                  activeOpacity={0.8}
                  onPress={deleteCurrentWord}
                >
                  <Text style={styles.btnTextDel}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.closeModalBtn}
              activeOpacity={0.8}
              onPress={() => closeModal()}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={24}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#4fc87a',
    borderRadius: 8,
    padding: 35,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },
  modalTextDel: {
    marginBottom: 20,
    fontSize: 16,
  },
  input: {
    padding: 10,
    width: '100%',
    borderRadius: 8,
    borderColor: '#E8E8E8',
    marginBottom: 20,
    marginTop: 10,
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  inputCard: {
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 10,
    padding: 10,
    width: '100%',
  },
  submitBtn: {
    flex: 1,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: btnWidth,
    marginVertical: 15 / 2,
    marginHorizontal: 15 / 2,
  },
  submitBtnText: {
    color: '#4fc87a',
  },
  btnTextDel: {
    color: '#ffffff',
  },
});
