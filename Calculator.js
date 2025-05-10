//Calculator//
// index.js

// Import the crypto module
const crypto = require('crypto');

// Get command line arguments (excluding 'node' and 'index.js')
const args = process.argv.slice(2);

// Extract the operation and numbers
const operation = args[0];
const num1 = parseFloat(args[1]);
const num2 = parseFloat(args[2]);

// Helper function for random number generation
function generateRandomNumber(length) {
  // crypto.randomBytes returns a Buffer; we convert it to a hex string and slice it
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// Check and execute based on operation
switch (operation) {
  case 'add':
    if (isNaN(num1) || isNaN(num2)) {
      console.log('Please provide two numbers for addition.');
    } else {
      console.log(`Result: ${num1 + num2}`);
    }
    break;

  case 'sub':
    if (isNaN(num1) || isNaN(num2)) {
      console.log('Please provide two numbers for subtraction.');
    } else {
      console.log(`Result: ${num1 - num2}`);
    }
    break;

  case 'mult':
    if (isNaN(num1) || isNaN(num2)) {
      console.log('Please provide two numbers for multiplication.');
    } else {
      console.log(`Result: ${num1 * num2}`);
    }
    break;

  case 'divide':
    if (isNaN(num1) || isNaN(num2)) {
      console.log('Please provide two numbers for division.');
    } else if (num2 === 0) {
      console.log('Error: Cannot divide by zero.');
    } else {
      console.log(`Result: ${num1 / num2}`);
    }
    break;

  case 'sin':
    if (isNaN(num1)) {
      console.log('Please provide one number (in radians) for sine.');
    } else {
      console.log(`Result: ${Math.sin(num1)}`);
    }
    break;

  case 'cos':
    if (isNaN(num1)) {
      console.log('Please provide one number (in radians) for cosine.');
    } else {
      console.log(`Result: ${Math.cos(num1)}`);
    }
    break;

  case 'tan':
    if (isNaN(num1)) {
      console.log('Please provide one number (in radians) for tangent.');
    } else {
      console.log(`Result: ${Math.tan(num1)}`);
    }
    break;

  case 'random':
    const length = parseInt(args[1]);
    if (isNaN(length)) {
      console.log('Provide length for random number generation.');
    } else {
      const randomNumber = generateRandomNumber(length);
      console.log(`Random Number (${length} chars): ${randomNumber}`);
    }
    break;

  default:
    console.log('Invalid operation');
}
