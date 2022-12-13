import { shuffle, range } from 'lodash';

export const getRandomArr = (min, max, words) => {
  const indArr = shuffle(range(min, max)).slice(0, 10);

  const arr = [];
  indArr.map((item) => {
    arr.push(words.find((element) => element.id === item.toString()));
  });
  console.log(indArr);
  return arr;
};
