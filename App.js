import { useKeepAwake } from 'expo-keep-awake';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider } from 'react-redux';
import { RootSiblingParent } from 'react-native-root-siblings';
import { VocabularyScreen } from './screen/mainScreen/VocabularyScreen';
import { DefaultScreen } from './screen/mainScreen/DefaultScreen';
import { store } from './redux/store';

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  useKeepAwake();
  return (
    <Provider store={store}>
      <RootSiblingParent>
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
              name="DefaultScreen"
              component={DefaultScreen}
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
      </RootSiblingParent>
    </Provider>
  );
}
