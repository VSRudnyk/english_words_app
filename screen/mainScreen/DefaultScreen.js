import { createStackNavigator } from '@react-navigation/stack';
import { SelectionTaskScreen } from '../nestedScreen/SelectionTaskScreen';
import { PracticeScreen } from '../nestedScreen/PracticeScreen';

const NestedScreen = createStackNavigator();

export const DefaultScreen = () => {
  return (
    <NestedScreen.Navigator
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: 'white',
        headerStyle: { backgroundColor: '#4fc87a' },
        headerTitleAlign: 'center',
      }}
    >
      <NestedScreen.Screen
        name="SelectionTaskScreen"
        component={SelectionTaskScreen}
        options={{
          title: 'Task selection',
        }}
      />
      <NestedScreen.Screen name="Practice" component={PracticeScreen} />
    </NestedScreen.Navigator>
  );
};
