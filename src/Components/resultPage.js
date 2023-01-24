import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import { ucFirst } from '../functions/ucFirst';

export const ResultPage = ({ practiceMore, result, total, errorAnswer }) => {
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
        <View style={styles.completedContainer}>
          <View style={{ position: 'absolute' }}>
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
          <Text style={styles.completed}>Completed</Text>
          <Text style={styles.result}>{`${result}/${total}`}</Text>
        </View>
        {errorAnswer.length > 0 && (
          <View style={styles.mistakeContainer}>
            <Text style={{ fontSize: 20, marginBottom: 25 }}>
              You made mistakes in the following words:
            </Text>
            <FlatList
              style={{ width: '100%' }}
              data={errorAnswer}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.mistakeWordContainer}>
                  <Text style={styles.itemText}>{ucFirst(item.word)}</Text>
                  <Text style={styles.itemText}>
                    {ucFirst(item.translation)}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
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
    marginHorizontal: 10,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 50,
    justifyContent: 'center',
  },
  completedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  congrats: {
    fontSize: 30,
    color: '#111',
    marginTop: 50,
    marginBottom: 50,
    textAlign: 'center',
  },
  completed: {
    fontSize: 20,
    color: '#56aaf9',
  },
  btn: {
    padding: 18,
    marginBottom: 10,
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
  mistakeContainer: {
    width: '100%',
    maxHeight: '50%',
    alignItems: 'center',
    marginTop: 55,
  },
  mistakeWordContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
