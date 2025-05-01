import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync(); // Оставляем Splash Screen видимым


export const SplashScreenComponent = ({ onAnimationEnd }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onAnimationEnd(); // Завершаем анимацию
    }, 4500);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);
  
  return isVisible ? (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash.gif')} // Укажите путь к вашему GIF
        style={styles.gif}
        resizeMode="contain"
      />
    </View>
    ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4fc87a', // Цвет фона
  },
  gif: {
    width: '100%',
    height: '100%',
  },
})
