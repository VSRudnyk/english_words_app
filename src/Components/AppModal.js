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
import { tostify } from '../functions/toast';
import {
  useAddWordMutation,
  useUpdateWordMutation,
  useDeleteWordMutation,
} from '../../redux/wordsAPi';

const windowWidth = Dimensions.get('window').width;
const btnWidth = (windowWidth - 15) / 2;

export const AppModal = ({
  words,
  closeModal,
  action,
  newWord,
  setNewWord,
}) => {
  const [addWord] = useAddWordMutation();
  const [updateWord] = useUpdateWordMutation();
  const [deleteWord] = useDeleteWordMutation();

  const normalizeWord = newWord.word.toLowerCase().trim();
  const normalizeTranslation = newWord.translation.toLowerCase().trim();
  const normalizeSynonyms = newWord.synonyms.toLowerCase().trim();

  const handleSubmit = () => {
    if (action === 'Add') {
      for (const word of words) {
        if (word.translation === normalizeTranslation) {
          tostify('This word is already in the vocabulary', '#ff8a7a', '#fff');
          closeModal();
          return;
        }
      }
      addWord({
        word: normalizeWord,
        translation: normalizeTranslation,
        synonyms: normalizeSynonyms,
      });
      tostify(
        `The word "${normalizeWord}" was added successfully`,
        '#4fc87a',
        '#fff'
      );
    } else if (action === 'Update') {
      for (const word of words) {
        if (word.translation === normalizeTranslation) {
          tostify(
            `The word "${normalizeWord}" is already in the vocabulary`,
            '#ff8a7a',
            '#fff'
          );
          closeModal();
          return;
        }
      }
      updateWord({
        id: newWord._id,
        word: normalizeWord,
        translation: normalizeTranslation,
        synonyms: normalizeSynonyms,
      });
    }
    closeModal();
  };

  const deleteCurrentWord = () => {
    deleteWord(newWord._id);
    closeModal();
    tostify(
      `The word "${normalizeWord}" was deleted successfully`,
      '#4fc87a',
      '#fff'
    );
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
        <View style={styles.centeredView}>
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
              value={newWord.word}
              onChangeText={(value) =>
                setNewWord((prevState) => ({
                  ...prevState,
                  word: value,
                }))
              }
            />
            <TextInput
              style={action === 'Add' ? styles.input : styles.inputCard}
              textAlign={'center'}
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
              <Text style={{ fontSize: 14 }}>Synonyms:</Text>
              <TextInput
                style={action === 'Add' ? styles.input : styles.inputCard}
                textAlign={'left'}
                placeholder={'Add synonyms here'}
                placeholderTextColor={'#BDBDBD'}
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
                  <Text style={styles.submitBtnText}>Delete</Text>
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
                color="#4fc87a"
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
    borderRadius: 8,
    borderColor: '#E8E8E8',
    marginBottom: 20,
    borderWidth: 1,
  },
  inputCard: {
    fontSize: 18,
  },
  submitBtn: {
    flex: 1,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#4fc87a',
    alignItems: 'center',
    justifyContent: 'center',
    width: btnWidth,
    marginVertical: 15 / 2,
    marginHorizontal: 15 / 2,
  },
  submitBtnText: {
    color: '#fff',
  },
});
