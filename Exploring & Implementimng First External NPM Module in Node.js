//Exploring & Implementimng First External NPM Module in Node.js//
// Import the boxen module
const boxen = require('boxen');

// Define message and title
const message = 'I am using my first external module!';
const title = 'Hurray!!!';

// Classic (default) box
const classicBox = boxen(message, {
  title: title,
  padding: 1,
  margin: 1,
  borderStyle: 'classic'
});

// SingleDouble box
const singleDoubleBox = boxen(message, {
  title: title,
  padding: 1,
  margin: 1,
  borderStyle: 'singleDouble'
});

// Round box
const roundBox = boxen(message, {
  title: title,
  padding: 1,
  margin: 1,
  borderStyle: 'round'
});

// Bonus: with background color and border color
const classicBoxColor = boxen(message, {
  title: title,
  padding: 1,
  margin: 1,
  borderStyle: 'classic',
  backgroundColor: 'blue',
  borderColor: 'yellow'
});

const singleDoubleBoxColor = boxen(message, {
  title: title,
  padding: 1,
  margin: 1,
  borderStyle: 'singleDouble',
  backgroundColor: 'green',
  borderColor: 'magenta'
});

const roundBoxColor = boxen(message, {
  title: title,
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  backgroundColor: 'cyan',
  borderColor: 'red'
});

// Print all boxes
console.log(classicBox);
console.log(singleDoubleBox);
console.log(roundBox);
console.log(classicBoxColor);
console.log(singleDoubleBoxColor);
console.log(roundBoxColor);
