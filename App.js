import { useKeepAwake } from 'expo-keep-awake';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider } from 'react-redux';
import { RootSiblingParent } from 'react-native-root-siblings';
import { VocabularyScreen } from './screen/mainScreen/VocabularyScreen';
import { DefaultScreen } from './screen/mainScreen/DefaultScreen';
import { store } from './redux/store';
import { SplashScreenComponent } from './src/Components/SplashScreen';
import { useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  useKeepAwake();

  const handleAnimationEnd = () => {
    setSplashVisible(false); // Скрываем Splash Screen после завершения анимации
    SplashScreen.hideAsync(); // Скрываем системный Splash Screen
  };

  if (isSplashVisible) {
    return <SplashScreenComponent onAnimationEnd={handleAnimationEnd} />;
  }

  return (
    <Provider store={store}>
      <RootSiblingParent>
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="VocabularyScreen"
            inactiveColor='#000'
            activeColor="#4fc87a"
            barStyle={{ backgroundColor: '#d5c7c7'}}
            backBehavior='firstRoute'
            sceneAnimationEnabled={true}
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
                  <MaterialCommunityIcons
                    name="brain"
                    color={color}
                    size={30}
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
