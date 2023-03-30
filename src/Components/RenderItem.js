import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
  } from 'react-native';
  import { ucFirst } from '../functions/ucFirst';

export const RenderItem = ({item, chekChosenAnswer, currentWord, disabled}) => {
    const [bgColor, setBgColor] = useState('transparent');
    const [textColor, setTextColor] = useState('#000');
    const [borderColor, setBorderColor] = useState('#dadada');
    
    useEffect(() => {
        setBgColor('transparent');
        setTextColor('#000');
        setBorderColor('#dadada');
      }, [currentWord])

    const handleChek = (item) => {
        chekChosenAnswer(item);
        if(item === currentWord.word) {
          setBgColor('#4fc87a');
          setTextColor('#fff');
          setBorderColor('#4fc87a');
        } else if(item != currentWord.word){
          setBgColor('#ff8a7a')
          setTextColor('#fff');
          setBorderColor('#ff8a7a');
        }
      }

    return (
        <TouchableOpacity style={{...styles.button, backgroundColor: bgColor, borderColor: borderColor}} onPress={() => handleChek(item.word)} disabled={disabled}>
            <Text style={{...styles.text, color: textColor}}>{ucFirst(item.translation)}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 18,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#dadada',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        backgroundColor: 'transparent'
      },
      text: {
        fontSize: 18,
        color: '#000'
      }
})