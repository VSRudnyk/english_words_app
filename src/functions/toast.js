import Toast from 'react-native-root-toast';

export const tostify = (text, bgColor, textColor) => {
  return Toast.show(text, {
    delay: 1000,
    duration: 5000,
    position: Toast.positions.CENTER,
    backgroundColor: bgColor,
    textColor: textColor,
    shadow: true,
    animation: true,
    hideOnPress: true,
    opacity: 1,
  });
};
