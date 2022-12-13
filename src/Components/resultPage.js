import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ResultPage = ({ trainMore, result, total }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.congrats}>Congrats, all is done!</Text>
      <Text style={styles.completed}>Completed:</Text>
      <Text style={styles.result}>{`${result}/${total}`}</Text>
      <TouchableOpacity onPress={trainMore} style={styles.btn}>
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
    marginHorizontal: 10,
    marginTop: 40,
    marginBottom: 60,
  },
  congrats: {
    fontSize: 30,
    color: '#111',
    marginBottom: 50,
  },
  completed: {
    fontSize: 20,
    color: '#111',
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
