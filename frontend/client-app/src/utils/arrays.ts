// get N random elements from an array, except the current element
export const getRandomElements = (array: any[], exceptIndex: number, n: number) => {
  const filteredArray = array.filter((element, i) => i !== exceptIndex);
  const shuffledArray = shuffle(filteredArray);
  return shuffledArray.slice(0, n);
}

export const shuffle = (array: any[]) => array.sort(() => 0.5 - Math.random())