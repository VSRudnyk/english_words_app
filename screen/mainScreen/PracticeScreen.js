import { StyleSheet, View } from 'react-native';
import { TranslateToEng } from '../../src/Components/TranslateToEng';

export const PracticeScreen = () => {
  return (
    <View style={styles.container}>
      <TranslateToEng />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 40,
    marginBottom: 20,
  },
});
