const wordsLists = require("./wordsLists");
const searchBinary = require("./searchBinary");

const createVanityNumbers = (phoneNumber) => {
  const phoneNumberArray = phoneNumber
    .substring(phoneNumber.length - 10, phoneNumber.length)
    .split("");

  var foundWords = [];
  const generateWord = (currentWord, numArray, origArray, ref, length) => {
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

    const wordSearch = searchBinary(testWord, wordsLists[length], foundWords);
    if (wordSearch[0] && testWord.length === length) {
      // Found a word
      foundWords.push(testWord);
      return testWord;
    } else if (wordSearch.length > 0) {
      // Found a potential match, move forward
      return generateWord(
        testWord,
        numArray.slice(1, numArray.length),
        origArray,
        0,
        length
      );
    } else if (ref < numbersRef[numArray[0]].length - 1) {
      // more options available, try again with next reference
      return generateWord(currentWord, numArray, origArray, ref + 1, length);
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
              length
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
        fullNumberArray.length
      );
      if (result) vanityNumbers.push(prefix + result);
    } while (result);

  if (vanityNumbers.length < 5) {
    let firstThreeArray = phoneNumberArray.slice(3, 6);
    const firstThree = [];
    do {
      result = generateWord(
        "",
        firstThreeArray,
        firstThreeArray,
        0,
        firstThreeArray.length
      );
      if (result) firstThree.push(result);
    } while (result);
    let lastFourArray = phoneNumberArray.slice(6, phoneNumberArray.length);
    const lastFour = [];
    do {
      result = generateWord(
        "",
        lastFourArray,
        lastFourArray,
        0,
        lastFourArray.length
      );
      if (result) lastFour.push(result);
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
  if (vanityNumbers.length < 5) {
    for (var q = 0; q < phoneNumberArray.length; q++) {
      // Start from the front of the number and check six characters first.
      let chunk = phoneNumberArray.slice(3 + q, phoneNumberArray.length);
      for (let i = 0; i < chunk.length; i++) {
        let newchunk = i > 0 ? chunk.slice(0, -i) : chunk;
        do {
          if (newchunk.length > 1) {
            result = generateWord("", newchunk, newchunk, 0, newchunk.length);
          }
          if (result) {
            //if we found something, go through the rest of the numbers and see if there is another word
            let therest = phoneNumberArray.slice(result.length + q + 3);
            if (therest.length === 0) {
              let finalnum =
                prefix + phoneNumberArray.slice(3, q + 3).join("") + result;
              if (!vanityNumbers.includes(finalnum)) {
                vanityNumbers.push(finalnum);
              }
            } else if (therest.length === 1) {
              let finalnum =
                prefix +
                phoneNumberArray.slice(3, q + 3).join("") +
                result +
                phoneNumberArray[phoneNumberArray.length - 1];
              if (!vanityNumbers.includes(finalnum)) {
                vanityNumbers.push(finalnum);
              }
            } else if (therest.length > 1) {
              for (let j = 0; j <= therest.length - 1; j++) {
                do {
                  let lastchunk = therest.slice(j, therest.length);
                  if (lastchunk.length > 1) {
                    var newresult = generateWord(
                      "",
                      lastchunk,
                      lastchunk,
                      0,
                      lastchunk.length
                    );
                  }
                  if (newresult) {
                    const prenums =
                      q > 0 ? phoneNumberArray.slice(3, q + 3).join("") : "";
                    const midnums =
                      j > 0
                        ? phoneNumberArray
                            .slice(
                              3 + prenums.length + result.length,
                              3 + prenums.length + result.length + j
                            )
                            .join("")
                        : "";
                    let finalnum =
                      prefix +
                      prenums +
                      result +
                      midnums +
                      newresult +
                      phoneNumberArray
                        .slice(
                          result.length + q + midnums + newresult.length + 3
                        )
                        .join("");
                    if (!vanityNumbers.includes(finalnum)) {
                      vanityNumbers.push(finalnum);
                    }
                  } else {
                    if (q === 0 && result.length === 2) break;
                    const prenums =
                      q > 0 ? phoneNumberArray.slice(3, q + 3).join("") : "";
                    let finalnum = prefix + prenums + result + therest.join("");
                    if (!vanityNumbers.includes(finalnum)) {
                      vanityNumbers.push(finalnum);
                    }

                    if (vanityNumbers.length >= 5) break;
                  }
                } while (newresult);
              }
            }
            if (vanityNumbers.length >= 5) break;
          }

          if (vanityNumbers.length >= 5) break;
        } while (result);
      }
      if (vanityNumbers.length >= 5) break;
    }
  }
  if (vanityNumbers.length > 5) {
    const vanityArray = vanityNumbers.slice(0, 5);
    return vanityArray;
  }
  return vanityNumbers;
};

module.exports = createVanityNumbers;
