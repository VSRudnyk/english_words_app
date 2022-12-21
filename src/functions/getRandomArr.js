import { shuffle, range } from 'lodash';

export const getRandomArr = (min, max, words) => {
  const indArr = shuffle(words).slice(min, max);

  // const arr = [];
  // indArr.map((item) => {
  //   arr.push(words.find((element) => element.id === item));
  // });

  // return Math.floor(Math.random() * (max - min + 1)) + min;
  return indArr;
};
