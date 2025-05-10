//Basic Math Operations//


// Define operations as functions
function sum(a, b) {
    return a + b;
  }
  
  function multiply(a, b) {
    return a * b;
  }
  
  function subtract(a, b) {
    return a - b;
  }
  
  function divide(a, b) {
    if (b === 0) {
      return 'Error: Cannot divide by zero';
    }
    return a / b;
  }
  
  // Check if command-line arguments are provided
  const args = process.argv.slice(2); // remove 'node' and 'index.js'
  
  if (args.length >= 3) {
    const operation = args[0];
    const a = Number(args[1]);
    const b = Number(args[2]);
  
    let result;
  
    switch (operation) {
      case 'sum':
        result = sum(a, b);
        break;
      case 'multiply':
        result = multiply(a, b);
        break;
      case 'subtract':
        result = subtract(a, b);
        break;
      case 'divide':
        result = divide(a, b);
        break;
      default:
        result = 'Error: Unknown operation';
    }
  
    console.log(`Result: ${result}`);
  } else {
    // Run default tests if no CLI args
    let sumA = 3;
    let sumB = 5;
    let sumResult = sum(sumA, sumB);
    console.log(`Sum: ${sumResult}`);
  
    let mulA = 4;
    let mulB = 6;
    let mulResult = multiply(mulA, mulB);
    console.log(`Multiply: ${mulResult}`);
  
    let subA = 10;
    let subB = 4;
    let subResult = subtract(subA, subB);
    console.log(`Subtract: ${subResult}`);
  
    let divA = 20;
    let divB = 4;
    let divResult = divide(divA, divB);
    console.log(`Divide: ${divResult}`);
  
    let divByZero = divide(10, 0);
    console.log(`Divide by zero test: ${divByZero}`);
  }
  