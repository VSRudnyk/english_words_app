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
import { isEmpty, over, set } from 'lodash';
import { LinearGradient } from 'expo-linear-gradient';
import { ucFirst } from '../../src/functions/ucFirst';
import { useGetWordsQuery } from '../../redux/wordsAPi';
import { NoDataFound } from '../../src/Components/NoDataFound';
import { Loader } from '../../src/Components/Loader';
import { AppModal } from '../../src/Components/AppModal';
import { CustomDropdown } from '../../src/Components/CustomDropdown';

const initialState = {
  word: '',
  translation: '',
  synonyms: '',
};

const sortOptions = [
  { label: 'Recent', value: 'recent' },
  { label: 'Correct', value: 'correct' },
  { label: 'Incorrect', value: 'incorrect' },
  { label: 'Low progress', value: 'low-progress' },
  { label: 'High progress', value: 'high-progress' },
  { label: 'Ascending', value: 'ascending' },
  { label: 'Descending', value: 'descending' },
];

export const VocabularyScreen = () => {
  const { data, isFetching, isSuccess } = useGetWordsQuery();
  const [newWord, setNewWord] = useState(initialState);
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState('');
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent');

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

  const sortwords = (sortBy) => {
    switch (sortBy) {
      case 'recent':
        return [...visibleWords].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case 'correct':
        return [...visibleWords].sort((a, b) => {
          const aTotal =
            (a.correctAnswersCount || 0) + (a.incorectAnswersCount || 0);
          const bTotal =
            (b.correctAnswersCount || 0) + (b.incorectAnswersCount || 0);
          const aPercent = aTotal ? (a.correctAnswersCount || 0) / aTotal : 0;
          const bPercent = bTotal ? (b.correctAnswersCount || 0) / bTotal : 0;
          return bPercent - aPercent; // по убыванию процента правильных
        });
      case 'incorrect':
        return [...visibleWords].sort((a, b) => {
          const aTotal =
            (a.correctAnswersCount || 0) + (a.incorectAnswersCount || 0);
          const bTotal =
            (b.correctAnswersCount || 0) + (b.incorectAnswersCount || 0);
          const aPercent = aTotal ? (a.incorectAnswersCount || 0) / aTotal : 0;
          const bPercent = bTotal ? (b.incorectAnswersCount || 0) / bTotal : 0;
          return bPercent - aPercent; // по убыванию процента ошибок
        });
      case 'low-progress':
        return [...visibleWords].sort((a, b) => {
          const aTotal =
            (a.correctAnswersCount || 0) + (a.incorectAnswersCount || 0);
          const bTotal =
            (b.correctAnswersCount || 0) + (b.incorectAnswersCount || 0);

          if (aTotal === 0) return -1;
          if (bTotal === 0) return 1;

          const aProgress = (a.correctAnswersCount || 0) / aTotal;
          const bProgress = (b.correctAnswersCount || 0) / bTotal;

          return aProgress - bProgress;
        });

      case 'high-progress':
        return [...visibleWords].sort((a, b) => {
          const aTotal =
            (a.correctAnswersCount || 0) + (a.incorectAnswersCount || 0);
          const bTotal =
            (b.correctAnswersCount || 0) + (b.incorectAnswersCount || 0);

          if (aTotal === 0) return 1;
          if (bTotal === 0) return -1;

          const aProgress = (a.correctAnswersCount || 0) / aTotal;
          const bProgress = (b.correctAnswersCount || 0) / bTotal;

          return bProgress - aProgress;
        });

      case 'ascending':
        return [...visibleWords].sort((a, b) => a.word.localeCompare(b.word));
      case 'descending':
        return [...visibleWords].sort((a, b) => b.word.localeCompare(a.word));
      default:
        return visibleWords;
    }
  };
  if (isFetching) return <Loader />;

  return (
    <>
      <View style={styles.container}>
        {isEmpty(words) ? (
          <NoDataFound />
        ) : (
          <View style={{ width: '100%' }}>
            <View style={styles.headerContainer}>
              <Text style={styles.vacabularyHeader}>
                Total words in the vocabulary: {words.length}
              </Text>
            </View>
            <CustomDropdown
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              label={'Sort by: '}
              placeholder={'Sort by'}
            />
            <FlatList
              style={{ width: '100%' }}
              showsVerticalScrollIndicator={false}
              data={sortwords(sortBy)}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const correct = item.correctAnswersCount || 0;
                const incorrect = item.incorectAnswersCount || 0;
                const total = correct + incorrect;
                const percentIncorrect = total ? incorrect / total : 0;
                return (
                  <View>
                    <TouchableOpacity
                      style={{
                        ...styles.itemContainer,
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                      }}
                      onPress={() => openModal('Update', item)}
                      activeOpacity={0.8}
                    >
                      {total > 0 && (
                        <LinearGradient
                          colors={[
                            'rgba(255,138,122,0.5)',
                            'rgba(79, 200, 122, 0.5)',
                          ]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          locations={[percentIncorrect, percentIncorrect]}
                          style={StyleSheet.absoluteFill}
                        />
                      )}
                      <Text style={styles.itemText}>{ucFirst(item.word)}</Text>
                      <Text style={styles.itemText}>
                        {ucFirst(item.translation)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        )}
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
            style={{ position: 'absolute', right: 30 }}
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4fc87a',
    overflow: 'hidden',
  },
  headerContainer: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    width: '100%',
    backgroundColor: '#4fc87a',
  },
  vacabularyHeader: {
    padding: 10,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4fc87a',
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
  },
  filterContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  filterInput: {
    padding: 8,
    height: 40,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#4fc87a',
    marginRight: 10,
  },
});
