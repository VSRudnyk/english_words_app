import { useKeepAwake } from 'expo-keep-awake';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider } from 'react-redux';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MainScreen } from './screen/mainScreen/MainScreen';
import { DefaultScreen } from './screen/mainScreen/DefaultScreen';
import { store } from './redux/store';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthScreen } from './screen/mainScreen/AuthScreen';
import { useAuth } from './src/hooks/useAuth';
import { Loader } from './src/Components/Loader';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff', // Белый фон
    surface: '#ffffff', // Белый фон для компонентов
    text: '#000000', // Чёрный текст
    primary: '#4fc87a', // Основной цвет
    accent: '#4fc87a', // Акцентный цвет
  },
};

const AuthNavigator = ({ setIsAuth }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="AuthNavigator">
        {(props) => <AuthScreen {...props} setIsAuth={setIsAuth} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      backBehavior="firstRoute"
      screenOptions={{
        tabBarStyle: {
          height: 64,
          paddingTop: 10,
          backgroundColor: '#4fc87a',
        },
        tabBarActiveTintColor: '#0E9CE6',
        tabBarInactiveTintColor: '#ffffff',
        animation: 'shift',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="MainScreen"
        component={MainScreen}
        options={{
          tabBarLabel: 'Words',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="file-word-box"
              color={color}
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        name="DefaultScreen"
        component={DefaultScreen}
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="brain" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const { readUser, isLoading } = useAuth();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await readUser();
      if (!isEmpty(userData)) setIsAuth(true);
    };
    checkAuth();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <Stack.Navigator>
      {isAuth ? (
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen name="Auth" options={{ headerShown: false }}>
          {(props) => <AuthNavigator {...props} setIsAuth={setIsAuth} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  useKeepAwake();
  return (
    <Provider store={store}>
      <PaperProvider theme={lightTheme}>
        <RootSiblingParent>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </RootSiblingParent>
      </PaperProvider>
    </Provider>
  );
}
