const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const textFile = fs.createWriteStream(filePath);

console.log("Enter text (type 'exit' to quit):");

process.stdin.on('data', (data) => {
  data = data.toString().trim();

  if (data === 'exit') {
    console.log('alahamora');
    process.exit();
  } 

  textFile.write(data + '\n');
});


process.on('SIGINT', () => {
  console.log('alahamora');
  process.exit();
});