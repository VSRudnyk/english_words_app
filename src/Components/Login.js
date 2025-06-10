import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useWords } from '../hooks/useWords';
import { useRegisterMutation } from '../../redux/authAPI';
import { tostify } from '../functions/toast';
import { Loader } from './Loader';

const initialState = {
  email: '',
  password: '',
};

export const Login = ({ setIsAuth }) => {
  const [userData, setUserData] = useState(initialState);
  const [register, { isLoading: isUpdating }] = useRegisterMutation();
  const { writeUser, isLoading } = useAuth();
  const { writeWords } = useWords();

  const handleChange = (name, value) => {
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const newUser = {
        email: userData.email,
        password: userData.password,
      };

      const userObject = await register(newUser).unwrap();
      const { user, words } = userObject;

      if (words) {
        await writeWords(words);
      }

      if (user) {
        await writeUser(user);
        setUserData(initialState);
        tostify(
          `User "${user.email}" was register successfully`,
          '#4fc87a',
          '#fff'
        );
      }
      setIsAuth(true);
    } catch (error) {
      console.error('Registration failed:', error);
      tostify(`User with ${userData.email} already exist`, '#ff8a7a', '#fff');
    }
  };

  if (isLoading || isUpdating) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Welcome to VocApp</Text>
        <TextInput
          style={styles.loginInput}
          placeholder={'Email'}
          placeholderTextColor={'#BDBDBD'}
          selectionColor={'#4fc87a'}
          value={userData.email}
          onChangeText={(value) => handleChange('email', value)}
        />
        <TextInput
          style={styles.loginInput}
          placeholder={'Password'}
          placeholderTextColor={'#BDBDBD'}
          selectionColor={'#4fc87a'}
          value={userData.password}
          onChangeText={(value) => handleChange('password', value)}
        />
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitBtnText}>
            {isLoading ? 'Loading...' : 'Log in'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
  },
  loginContainer: {
    marginHorizontal: 10, // Add 10px margins on left and right
    backgroundColor: '#4fc87a',
    borderRadius: 8,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  loginInput: {
    padding: 10,
    width: '100%',
    borderRadius: 8,
    borderColor: '#E8E8E8',
    marginBottom: 20,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  submitBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#4fc87a',
    fontSize: 16,
    fontWeight: '500',
  },
});
