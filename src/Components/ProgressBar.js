import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import * as Progress from 'react-native-progress';

export const ProgressBar = ({ numberOfWord, numberOfAllWord }) => {
  const { width } = useWindowDimensions();
  return (
    <>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Translate the word</Text>
        <Text style={styles.progressText}>{`${
          numberOfWord - 1
        }/${numberOfAllWord}`}</Text>
      </View>
      <Progress.Bar
        progress={(numberOfWord - 1) / numberOfAllWord}
        width={width - 20}
        borderRadius={0}
        height={4}
        animated={false}
        unfilledColor={'#dadada'}
        color={'#4fc87a'}
        borderWidth={0}
      />
    </>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    color: '#111',
    fontSize: 16,
  },
});
