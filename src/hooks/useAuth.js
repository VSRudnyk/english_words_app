import { useState, useEffect, useCallback } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const { getItem, setItem } = useAsyncStorage('@user');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getToken = useCallback(async () => {
    try {
      const item = await getItem();
      const parsedUser = item ? JSON.parse(item) : null;
      return parsedUser?.token || null;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }, [getItem]);

  const getUserId = useCallback(async () => {
    try {
      const item = await getItem();
      const parsedUser = item ? JSON.parse(item) : null;
      return parsedUser?._id || null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }, [getItem]);

  const readUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const item = await getItem();
      const parsedUser = item ? JSON.parse(item) : null;
      setUser(parsedUser);
      return parsedUser;
    } catch (error) {
      console.error('Error reading user:', error);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getItem]);

  const writeUser = useCallback(
    async (userData) => {
      setIsLoading(true);
      try {
        const jsonValue = JSON.stringify(userData);
        await setItem(jsonValue);
        setUser(userData);
        return true;
      } catch (error) {
        console.error('Error writing user:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setItem]
  );

  const updateUser = useCallback(
    async (updatedData) => {
      setIsLoading(true);
      try {
        const currentUser = await readUser();
        const updatedUser = {
          ...currentUser,
          ...updatedData,
        };
        await writeUser(updatedUser);
        return true;
      } catch (error) {
        console.error('Error updating user:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [readUser, writeUser]
  );

  const removeUser = useCallback(async () => {
    setIsLoading(true);
    try {
      await setItem(null);
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error removing user:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setItem]);

  const clearAuthStorage = useCallback(async () => {
    setIsLoading(true);
    try {
      await setItem(JSON.stringify({})); // Set empty object instead of null
      // Or use removeItem if available from useAsyncStorage
      // await removeItem();
      setUser(null);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error clearing auth storage:', error);
      setIsLoading(false);
      return false;
    }
  }, [setItem]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await readUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return {
    user,
    isLoading,
    readUser,
    writeUser,
    updateUser,
    removeUser,
    getToken,
    getUserId,
    clearAuthStorage,
  };
};
