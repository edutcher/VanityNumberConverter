const wordsLists = require("./wordsLists");

const createVanityNumbers = (phoneNumber) => {
  const phoneNumberArray = phoneNumber
    .substring(phoneNumber.length - 10, phoneNumber.length)
    .split("");

  const foundWords = [];
  const generateWord = (currentWord, numArray, ref, length) => {
    if (numArray.length === 0) return false;

    let numbersRef = {
      0: ["0"],
      1: ["1"],
      2: ["A", "B", "C"],
      3: ["D", "E", "F"],
      4: ["G", "H", "I"],
      5: ["J", "K", "L"],
      6: ["M", "N", "O"],
      7: ["P", "Q", "R", "S"],
      8: ["T", "U", "V"],
      9: ["W", "X", "Y", "Z"],
    };

    const testWord = currentWord + numbersRef[numArray[0]][ref];
    const filterArray = wordsLists[length].filter((el) => {
      if (foundWords.includes(el)) return false;
      else return el.startsWith(testWord);
    });
    if (filterArray[0] && testWord.length === length) {
      // Found a word
      foundWords.push(testWord);
      return testWord;
    } else if (filterArray.length > 0) {
      // Found a potential match, move forward
      return generateWord(
        testWord,
        numArray.slice(1, numArray.length),
        0,
        length
      );
    } else if (ref < numbersRef[numArray[0]].length - 1) {
      // more options available, try again with next reference
      return generateWord(currentWord, numArray, ref + 1, length);
    } else {
      // go back if there were more choices available prior

      const lastChar = currentWord[currentWord.length - 1];
      if (currentWord.length > 0) {
        for (let i = currentWord.length - 1; i >= 0; i--) {
          let prevRef = numbersRef[tempArray[i]].indexOf(currentWord[i]);
          let lastRef = numbersRef[tempArray[i]].length - 1;
          if (prevRef < lastRef) {
            let formerWord = currentWord.slice(0, -(currentWord.length - i));
            let formerArray = tempArray.slice(i);
            return generateWord(formerWord, formerArray, prevRef + 1, length);
          }
        }
      } else return false;
    }
  };

  let tempArray = phoneNumberArray.slice(3, phoneNumberArray.length);
  const vanityNumbers = [];
  const prefix = phoneNumberArray.slice(0, 3).join("");
  var result;
  do {
    result = generateWord("", tempArray, 0, tempArray.length);
    if (result) vanityNumbers.push(prefix + result);
  } while (result === true);

  if (vanityNumbers.length < 5) {
    tempArray = [];
    tempArray = phoneNumberArray.slice(3, 6);
    const firstThree = [];
    do {
      result = generateWord("", tempArray, 0, tempArray.length);
      if (result) firstThree.push(result);
    } while (result);
    tempArray = [];
    tempArray = phoneNumberArray.slice(6, phoneNumberArray.length);
    const lastFour = [];
    do {
      result = generateWord("", tempArray, 0, tempArray.length);
      if (result) lastFour.push(result);
    } while (result);
    if (firstThree.length > 0 && lastFour.length > 0) {
      for (start of firstThree) {
        for (end of lastFour) {
          vanityNumbers.push(prefix + start + end);
        }
      }
    }
  }

  return vanityNumbers;
};

module.exports = createVanityNumbers;
