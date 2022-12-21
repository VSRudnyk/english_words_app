import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';

export const ResultPage = ({ practiceMore, result, total }) => {
  const progressPercent = () => {
    const percent = result / total;
    if (isNaN(percent)) {
      return 0;
    }
    return percent;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.congrats}>Congrats, all is done!</Text>
      <View style={styles.progressContainer}>
        <View style={{ ...styles.completedContainer }}>
          <Text style={styles.completed}>Completed:</Text>
          <Text style={styles.result}>{`${result}/${total}`}</Text>
        </View>
        <Progress.Circle
          size={130}
          progress={progressPercent()}
          borderWidth={0}
          thickness={10}
          strokeCap={'round'}
          color={'#56aaf9'}
          unfilledColor={'#cce6fd'}
        />
      </View>
      <TouchableOpacity onPress={practiceMore} style={styles.btn}>
        <Text style={styles.btnText}>PRACTICE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    marginHorizontal: 10,
    marginBottom: 60,
  },
  progressContainer: {
    position: 'relative',
  },
  completedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 40,
    left: 20,
  },
  congrats: {
    fontSize: 30,
    color: '#111',
    marginBottom: 50,
  },
  completed: {
    fontSize: 20,
    color: '#56aaf9',
  },
  btn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#4fc87a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  result: {
    color: '#56aaf9',
    fontSize: 20,
  },
});
