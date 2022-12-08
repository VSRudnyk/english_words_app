import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { VocabularyScreen } from './screen/mainScreen/VocabularyScreen';
import { PracticeScreen } from './screen/mainScreen/PracticeScreen';
import { store, persistor } from './redux/store';

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  useKeepAwake();
  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="VocabularyScreen"
            activeColor="#fff"
            barStyle={{ backgroundColor: '#4fc87a' }}
          >
            <Tab.Screen
              name="VocabularyScreen"
              component={VocabularyScreen}
              options={{
                tabBarLabel: 'Words',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="file-word-box"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="PracticeScreen"
              component={PracticeScreen}
              options={{
                tabBarLabel: 'Practice',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="brain"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    </PersistGate>
  );
}
