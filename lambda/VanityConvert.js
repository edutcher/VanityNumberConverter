const wordsLists = require("./wordsLists");
const searchBinary = require("./searchBinary");

const createVanityNumbers = (phoneNumber) => {
  const phoneNumberArray = phoneNumber
    .substring(phoneNumber.length - 10, phoneNumber.length)
    .split("");

  var foundWords = [];
  const generateWord = (currentWord, numArray, origArray, ref, found) => {
    //Recursively build out words from a number array, short circuit out if no words of the full length are found that start with the letters we are building.
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
  // check for the "best" outcomes; either a seven letter word or a three letter followed by a four letter
  // ignore this block if the number contains 0 or 1 since it can't be seven characters
  if (
    !phoneNumberArray.slice(3).includes("0") &&
    !phoneNumberArray.slice(3).includes("1")
  )
    do {
      let fullNumberArray = phoneNumberArray.slice(3, phoneNumberArray.length);
      result = generateWord(
        "",
        fullNumberArray,
        fullNumberArray,
        0,
        foundWords
      );
      if (result) vanityNumbers.push(prefix + result);
    } while (result);
  foundWords = [];
  if (vanityNumbers.length < 5) {
    let firstThreeArray = phoneNumberArray.slice(3, 6);
    const firstThree = [];
    do {
      result = generateWord(
        "",
        firstThreeArray,
        firstThreeArray,
        0,
        firstThree
      );
    } while (result);
    let lastFourArray = phoneNumberArray.slice(6, phoneNumberArray.length);
    const lastFour = [];
    do {
      result = generateWord("", lastFourArray, lastFourArray, 0, lastFour);
    } while (result);
    if (firstThree.length > 0 && lastFour.length > 0) {
      for (start of firstThree) {
        for (end of lastFour) {
          let finalnum = prefix + start + end;
          if (!vanityNumbers.includes(finalnum)) {
            vanityNumbers.push(finalnum);
          }
        }
      }
    }
  }
  foundWords = [];
  // if we don't have 5 best case, programmatically go through the number array in chunks
  // This can probably be done better recursively
  result = false;
  if (vanityNumbers.length < 5) {
    for (let i = 6; i >= 2; i--) {
      let span = 6 - i;
      for (let j = 0; j <= span; j++) {
        let chunk = phoneNumberArray.slice(j + 3, 3 + i + j);
        do {
          result = generateWord("", chunk, chunk, 0, foundWords);
          if (result) {
            let theRest = phoneNumberArray.slice(3 + result.length + j);
            if (theRest.length > 1) {
              for (let q = 0; q <= theRest.length - 2; q++) {
                let newResult = false;
                let newChunk = theRest.slice(q);
                let newFoundWords = [];
                do {
                  newResult = generateWord(
                    "",
                    newChunk,
                    newChunk,
                    0,
                    newFoundWords
                  );
                } while (newResult);
                if (newFoundWords.length > 0) {
                  for (let firstWord of foundWords) {
                    for (let lastWord of newFoundWords) {
                      let finalNumber =
                        prefix +
                        phoneNumberArray.slice(3, 3 + j).join("") +
                        firstWord +
                        phoneNumberArray
                          .slice(
                            3 + j + firstWord.length,
                            3 + j + firstWord.length + q
                          )
                          .join("") +
                        lastWord +
                        phoneNumberArray
                          .slice(
                            3 + j + firstWord.length + q + lastWord.length,
                            phoneNumberArray.length
                          )
                          .join("");
                      if (!vanityNumbers.includes(finalNumber)) {
                        vanityNumbers.push(finalNumber);
                        if (vanityNumbers.length >= 5) break;
                      }
                    }
                  }
                } else {
                  for (let word of foundWords) {
                    let finalNumber =
                      prefix +
                      phoneNumberArray.slice(3, 3 + j).join("") +
                      word +
                      phoneNumberArray.slice(3 + j + word.length).join("");
                    if (!vanityNumbers.includes(finalNumber)) {
                      vanityNumbers.push(finalNumber);
                      if (vanityNumbers.length >= 5) break;
                    }
                  }
                }
                newFoundWords = [];
              }
            } else {
              let finalNumber =
                prefix +
                phoneNumberArray.slice(3, 3 + j).join("") +
                result +
                theRest.join("");
              if (!vanityNumbers.includes(finalNumber)) {
                vanityNumbers.push(finalNumber);
                if (vanityNumbers.length >= 5) break;
              }
            }
          }
        } while (result);
        if (vanityNumbers.length >= 5) break;
        foundWords = [];
      }
    }
  }
  if (vanityNumbers.length > 5) {
    const vanityArray = vanityNumbers.slice(0, 5);
    return vanityArray;
  }
  return vanityNumbers;
};

module.exports = createVanityNumbers;
