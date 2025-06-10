import { BackHandler, Alert, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Login } from '../../src/Components/Login';

const NestedScreen = createStackNavigator();

export const AuthScreen = ({ setIsAuth }) => {
  const backAction = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          BackHandler.exitApp();
        },
      },
    ]);
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);
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
          <TouchableOpacity onPress={backAction} style={{ marginRight: 15 }}>
            <MaterialCommunityIcons
              name="exit-to-app"
              size={24}
              color="#ffffff"
            />
          </TouchableOpacity>
        ),
      }}
    >
      <NestedScreen.Screen
        name="Login"
        options={{
          title: 'Login',
        }}
      >
        {(props) => <Login {...props} setIsAuth={setIsAuth} />}
      </NestedScreen.Screen>
    </NestedScreen.Navigator>
  );
};
