import { StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const AnswerInput = ({
  inputColor,
  chekAnswer,
  disabled,
  word,
  answer,
  setAnswer,
  checkBtn,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={{
          ...styles.input,
          borderColor: inputColor('#dadada'),
          color: inputColor('#111'),
          width:
            chekAnswer === 'Ok' || chekAnswer === 'Mistake' ? '100%' : '88%',
        }}
        textAlign={'center'}
        selectTextOnFocus={disabled}
        editable={!disabled}
        autoFocus={true}
        cursorColor={'#4fc87a'}
        placeholder={`Enter the translation (${
          word.replace(/[^a-zа-яё]/gi, '').length
        } letters)`}
        placeholderTextColor={'#BDBDBD'}
        selectionColor={'#4fc87a'}
        value={answer}
        onChangeText={(value) => setAnswer(value)}
      />
      <TouchableOpacity
        style={{
          display:
            chekAnswer === 'Ok' || chekAnswer === 'Mistake' ? 'none' : 'flex',
        }}
        activeOpacity={0.8}
        onPress={checkBtn}
        disabled={answer.length < 1}
      >
        <MaterialCommunityIcons
          name="arrow-right-box"
          size={50}
          color="#4fc87a"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    height: 40,
    maxHeight: 100,
    padding: 10,
    margin: 'auto',
    borderWidth: 2,
    borderRadius: 6,
    fontSize: 20,
  },
});
