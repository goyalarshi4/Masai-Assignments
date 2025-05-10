//Exploring & Implementing the Chalk Module in Node.js//
// Import the chalk module
const chalk = require('chalk');

// Print two messages in different colors
console.log(chalk.blue('Hello, World!'));
console.log(chalk.yellow('Learning Chalk is fun!'));

// Print two messages with background colors
console.log(chalk.black.bgYellow('Warning! Proceed with caution.'));
console.log(chalk.white.bgRed('Error! Something went wrong.'));

// Print two messages with multiple colors
console.log(chalk.green('Success:') + ' ' + chalk.white('Operation completed!'));
console.log(chalk.cyan('Loading...') + ' ' + chalk.magenta('Please wait'));

// Define custom themes
const error = chalk.bold.red;
const warning = chalk.bold.keyword('orange');
const success = chalk.bold.green;

// Use the custom themes to print messages
console.log(error('Error: Unable to connect to the server!'));
console.log(warning('Warning: Low disk space!'));
console.log(success('Success: Data saved successfully!'));

// Bonus: Add underline, italic, strikethrough, and RGB/HEX colors
console.log(chalk.underline.blue('Underlined message in blue'));
console.log(chalk.italic.rgb(255, 165, 0)('Italic orange message using RGB'));
console.log(chalk.strikethrough.hex('#FF1493')('Strikethrough pink message using HEX'));
