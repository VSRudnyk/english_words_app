import { createStackNavigator } from '@react-navigation/stack';
import { SelectionTaskScreen } from '../nestedScreen/SelectionTaskScreen';
import { PracticeScreen } from '../nestedScreen/PracticeScreen';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NestedScreen = createStackNavigator();

export const DefaultScreen = () => {
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
        name="SelectionTaskScreen"
        component={SelectionTaskScreen}
        options={{
          title: 'Task selection',
          headerLeft: () => null, // Remove back button from SelectionTaskScreen
        }}
      />
      <NestedScreen.Screen
        name="Practice"
        component={PracticeScreen}
        options={({ navigation }) => ({
          title: 'Practice',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()} // Use goBack instead of navigate
              style={{ marginLeft: 10 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
    </NestedScreen.Navigator>
  );
};
