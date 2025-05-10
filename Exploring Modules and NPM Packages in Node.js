//Exploring Modules and NPM Packages in Node.js//
// index.js

const randomWords = require('random-words');

// Function to check if a word is a palindrome
function checkPalindrome(word) {
  const reversed = word.split('').reverse().join('');
  return word === reversed;
}

// Function to count the number of vowels in a word
function countVowels(word) {
  const vowels = 'aeiou';
  let count = 0;
  for (let char of word.toLowerCase()) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}

// Generate an array of 5 random words
const words = randomWords(5);

words.forEach((word, index) => {
  const vowelsCount = countVowels(word);
  const isPalindrome = checkPalindrome(word);
  console.log(
    `word ${index + 1} -> ${word} -> vowelsCount: ${vowelsCount} -> isPalindrome: ${isPalindrome}`
  );
});
