import { useState, useEffect, useCallback } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export const useWords = () => {
  const { getItem, setItem } = useAsyncStorage('@words');
  const { getItem: getDeletedWords, setItem: setDeletedWords } =
    useAsyncStorage('@deleted_words');
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      const words = await readWords();
      setWords(words);
    };
    fetchWords();
  }, []);

  const clearAllStorage = useCallback(async () => {
    setIsLoading(true);
    try {
      // Clear words storage
      await setItem(JSON.stringify([]));
      // Clear deleted words storage
      await setDeletedWords(JSON.stringify([]));
      // Reset words state
      setWords([]);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setItem, setDeletedWords]);

  const readWords = useCallback(async () => {
    setIsLoading(true);
    try {
      const item = await getItem();
      const parsedItems = item ? JSON.parse(item) : [];
      setWords(parsedItems);
      return parsedItems;
    } catch (error) {
      console.error('Error reading words:', error);
      setWords([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [getItem]);

  const writeWords = useCallback(
    async (newWords) => {
      setIsLoading(true);
      try {
        const jsonValue = JSON.stringify(newWords);
        await setItem(jsonValue);
        setWords(newWords);
        return true;
      } catch (error) {
        console.error('Error writing words:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setItem]
  );

  const addWord = useCallback(
    async (newWord) => {
      setIsLoading(true);
      try {
        const currentWords = await readWords();
        const updatedWords = [...currentWords, newWord];
        await writeWords(updatedWords);
        return true;
      } catch (error) {
        console.error('Error adding word:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [readWords, writeWords]
  );

  const updateWord = useCallback(
    async (updatedWord) => {
      setIsLoading(true);
      try {
        const currentWords = await readWords();
        const updatedWords = currentWords.map((word) =>
          word.id === updatedWord.id ? updatedWord : word
        );
        await writeWords(updatedWords);
        return true;
      } catch (error) {
        console.error('Error updating word:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [readWords, writeWords]
  );

  const deleteWord = useCallback(
    async (wordId) => {
      setIsLoading(true);
      try {
        const currentWords = await readWords();
        const updatedWords = currentWords.filter((word) => word.id !== wordId);
        await writeWords(updatedWords);
        return true;
      } catch (error) {
        console.error('Error deleting word:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [readWords, writeWords]
  );

  const writeDeletedWordId = useCallback(async (wordId) => {
    setIsLoading(true);
    try {
      const currentDeletedWords = await getDeletedWords();
      const deletedWordsArr = currentDeletedWords
        ? JSON.parse(currentDeletedWords)
        : [];

      if (!deletedWordsArr.includes(wordId)) {
        const updatedDeletedWords = [...deletedWordsArr, wordId];
        await setDeletedWords(JSON.stringify(updatedDeletedWords));
      }

      return true;
    } catch (error) {
      console.error('Error saving deleted word ID:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const readDeletedWords = useCallback(async () => {
    setIsLoading(true);
    try {
      const item = await getDeletedWords();
      const parsedItems = item ? JSON.parse(item) : [];
      return parsedItems;
    } catch (error) {
      console.error('Error reading deleted words:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [getDeletedWords]);

  const clearDeletedWords = useCallback(async () => {
    setIsLoading(true);
    try {
      await setDeletedWords(JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error clearing deleted words:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setDeletedWords]);

  const updateWordStats = useCallback(
    async (updatedWords) => {
      setIsLoading(true);
      try {
        const currentWords = await readWords();
        const updatedWordsList = currentWords.map((word) => {
          const updatedWord = updatedWords.find((w) => w.id === word.id);
          if (updatedWord) {
            return {
              ...word,
              ...updatedWord,
              pendingSync: true,
            };
          }
          return word;
        });

        await writeWords(updatedWordsList);
        return true;
      } catch (error) {
        console.error('Error updating word stats:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [readWords, writeWords]
  );

  return {
    words,
    isLoading,
    readWords,
    writeWords,
    addWord,
    updateWord,
    deleteWord,
    writeDeletedWordId,
    readDeletedWords,
    clearDeletedWords,
    updateWordStats,
    clearAllStorage,
  };
};
