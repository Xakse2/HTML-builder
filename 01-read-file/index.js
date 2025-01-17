const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const fileContent = fs.createReadStream(filePath);

fileContent.pipe(process.stdout);