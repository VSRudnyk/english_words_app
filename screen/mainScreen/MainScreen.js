import { createStackNavigator } from '@react-navigation/stack';
import { VocabularyScreen } from '../nestedScreen/VocabularyScreen';

const NestedScreen = createStackNavigator();

export const MainScreen = () => {
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
      }}
    >
      <NestedScreen.Screen
        name='Vocabulary'
        component={VocabularyScreen}
        options={{
          title: 'Vocabulary',
        }}
      />
    </NestedScreen.Navigator>
  );
};
