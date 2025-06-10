import { BackHandler, Alert, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { VocabularyScreen } from '../nestedScreen/VocabularyScreen';
import {
  useBulkUpdateWordsMutation,
  useDeleteWordsMutation,
} from '../../redux/wordsAPi';
import { useWords } from '../../src/hooks/useWords';
import { useAuth } from '../../src/hooks/useAuth';
import { Loader } from '../../src/Components/Loader';

const NestedScreen = createStackNavigator();

export const MainScreen = () => {
  const {
    isLoading,
    readWords,
    writeWords,
    clearDeletedWords,
    readDeletedWords,
    clearAllStorage,
  } = useWords();
  const { clearAuthStorage } = useAuth();

  const [bulkUpdateWords, { isLoading: isUpdating }] =
    useBulkUpdateWordsMutation();
  const [deleteWords, { isLoading: isDeleting }] = useDeleteWordsMutation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const backAction = async () => {
    const words = await readWords();
    const pendingWords = words.filter((word) => word.pendingSync === true);
    console.log('Pending words:', pendingWords);
    const deletedWords = await readDeletedWords();
    console.log('Deleted words:', deletedWords);

    try {
      // Handle both updates and deletions if they exist
      const promises = [];

      if (pendingWords?.length > 0) {
        promises.push(
          bulkUpdateWords(pendingWords)
            .unwrap()
            .then(async () => {
              const updatedWords = words.map((word) => {
                if (pendingWords.some((pw) => pw.id === word.id)) {
                  return { ...word, pendingSync: false };
                }
                return word;
              });
              await writeWords(updatedWords);
            })
        );
      }

      if (deletedWords?.length > 0) {
        promises.push(
          deleteWords(deletedWords)
            .unwrap()
            .then(async () => {
              const updatedWords = words.filter(
                (word) => !deletedWords.some((dw) => dw.id === word.id)
              );
              await writeWords(updatedWords);
              await clearDeletedWords();
            })
        );
      }

      // Wait for all operations to complete
      if (promises.length > 0) {
        await Promise.all(promises);
        await readWords(); // Refresh local words after all operations
      }
    } catch (error) {
      console.error('Error syncing/deleting words:', error);
    }

    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  const clearStorage = async () => {
    try {
      await Promise.all([clearAuthStorage(), clearAllStorage()]);
      Alert.alert('Storage Cleared', 'All data has been cleared successfully.');
    } catch (error) {
      console.error('Error clearing storage:', error);
      Alert.alert('Error', 'Failed to clear storage.');
    }
  };

  if (isLoading || isUpdating || isDeleting) return <Loader />;

  return (
    <NestedScreen.Navigator
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#4fc87a',
          borderBottomEndRadius: 20,
          borderBottomStartRadius: 20,
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <>
            <TouchableOpacity
              onPress={clearStorage}
              style={{ marginRight: 15 }}
            >
              <MaterialCommunityIcons name="delete" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={backAction} style={{ marginRight: 15 }}>
              <MaterialCommunityIcons
                name="exit-to-app"
                size={24}
                color="#ffffff"
              />
            </TouchableOpacity>
          </>
        ),
      }}
    >
      <NestedScreen.Screen
        name="Vocabulary"
        options={{
          title: 'Vocabulary',
        }}
        component={VocabularyScreen}
      />
    </NestedScreen.Navigator>
  );
};
