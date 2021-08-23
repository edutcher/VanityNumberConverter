const wordsLists = require("./wordsLists");
const searchBinary = require("./searchBinary");

const createVanityNumbers = (phoneNumber) => {
  const phoneNumberArray = phoneNumber
    .substring(phoneNumber.length - 10, phoneNumber.length)
    .split("");

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

  let scrabbleScore = {
    A: 1,
    B: 3,
    C: 3,
    D: 2,
    E: 1,
    F: 4,
    G: 2,
    H: 4,
    I: 1,
    J: 8,
    K: 5,
    L: 1,
    M: 3,
    N: 1,
    O: 1,
    P: 3,
    Q: 10,
    R: 1,
    S: 1,
    T: 1,
    U: 1,
    V: 4,
    W: 4,
    X: 8,
    Y: 4,
    Z: 10,
  };

  var foundWords = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };
  const generateWord = (currentWord, numArray, origArray, ref, found) => {
    //Recursively build out words from a number array, short circuit out if no words of the full length are found that start with the letters we are building.
    if (numArray.length === 0) return false;

    const testWord = currentWord + numbersRef[numArray[0]][ref];

    const wordSearch = searchBinary(
      testWord,
      wordsLists[origArray.length],
      found
    );
    if (wordSearch[0] && testWord.length === origArray.length) {
      // Found a word
      found.push(testWord);
      return testWord;
    } else if (wordSearch.length > 0) {
      // Found a potential match, move forward
      return generateWord(
        testWord,
        numArray.slice(1, numArray.length),
        origArray,
        0,
        found
      );
    } else if (ref < numbersRef[numArray[0]].length - 1) {
      // more options available, try again with next reference
      return generateWord(currentWord, numArray, origArray, ref + 1, found);
    } else {
      // go back if there were more choices available prior
      const lastChar = currentWord[currentWord.length - 1];
      if (currentWord.length > 0) {
        for (let i = currentWord.length - 1; i >= 0; i--) {
          let prevRef = numbersRef[origArray[i]].indexOf(currentWord[i]);
          let lastRef = numbersRef[origArray[i]].length - 1;
          if (prevRef < lastRef) {
            let formerWord = currentWord.slice(0, -(currentWord.length - i));
            let formerArray = origArray.slice(i);
            return generateWord(
              formerWord,
              formerArray,
              origArray,
              prevRef + 1,
              found
            );
          }
        }
      } else return false;
    }
  };

  const vanityNumbers = [];
  const prefix = phoneNumberArray.slice(0, 3).join("");
  var result;

  //Find all words in all positions
  for (let i = 0; i <= 5; i++) {
    for (let j = 7 - i; j > 1; j--) {
      let chunk = phoneNumberArray.slice(3 + i, 3 + j + i);
      do {
        result = generateWord("", chunk, chunk, 0, foundWords[i]);
      } while (result);
    }
  }

  //Create all numbers and give them a score
  for (let i = 0; i <= 5; i++) {
    if (foundWords[i].length > 0) {
      for (let word of foundWords[i]) {
        if (word.length + i < 6) {
          for (let j = word.length + i; j <= 5; j++) {
            if (foundWords[j].length > 0) {
              for (let q = 0; q < foundWords[j].length; q++) {
                const midNums =
                  j > word.length + i ? -(word.length + i - j) : 0;

                let finalNumber =
                  prefix +
                  phoneNumberArray.slice(3, 3 + i).join("") +
                  word +
                  phoneNumberArray.slice(3 + i + word.length, 3 + j).join("") +
                  foundWords[j][q] +
                  phoneNumberArray
                    .slice(
                      3 + i + word.length + midNums + foundWords[j][q].length
                    )
                    .join("");
                let score = 0;
                for (let z = 0; z < word.length; z++) {
                  score += scrabbleScore[word[z]];
                }
                for (let z = 0; z < foundWords[j][q].length; z++) {
                  score += scrabbleScore[foundWords[j][q][z]];
                }
                let tempNum = { num: finalNumber, score };
                if (
                  vanityNumbers.filter((item) => item.num === tempNum.num)
                    .length === 0
                ) {
                  vanityNumbers.push(tempNum);
                }
              }
            } else {
              let finalNumber =
                prefix +
                phoneNumberArray.slice(3, 3 + i).join("") +
                word +
                phoneNumberArray.slice(3 + i + word.length).join("");
              let score = 0;
              for (let z = 0; z < word.length; z++) {
                score += scrabbleScore[word[z]];
              }
              let tempNum = { num: finalNumber, score };
              if (
                vanityNumbers.filter((item) => item.num === tempNum.num)
                  .length === 0
              ) {
                vanityNumbers.push(tempNum);
              }
            }
          }
        } else {
          let finalNumber =
            prefix +
            phoneNumberArray.slice(3, 3 + i).join("") +
            word +
            phoneNumberArray.slice(3 + i + word.length).join("");
          let score = 0;
          for (let z = 0; z < word.length; z++) {
            score += scrabbleScore[word[z]];
          }
          let tempNum = { num: finalNumber, score };
          if (
            vanityNumbers.filter((item) => item.num === tempNum.num).length ===
            0
          ) {
            vanityNumbers.push(tempNum);
          }
        }
      }
    }
  }

  //Sort Array
  const vanityArray = vanityNumbers.sort((a, b) => {
    if (a.score > b.score) {
      return -1;
    } else return 1;
  });

  //return top five
  if (vanityArray.length > 5)
    return vanityArray.slice(0, 5).map((item) => item.num);

  return vanityArray.map((item) => item.num);
};

module.exports = createVanityNumbers;
