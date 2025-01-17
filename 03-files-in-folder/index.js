const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function readFolder(folderPath) {
  const folderContent = await fs.promises.readdir(folderPath, { withFileTypes: true });
  
  for (const item of folderContent) {
    if (item.isFile()) {
      const filePath = path.join(folderPath, item.name);
      const fileStats = await fs.promises.stat(filePath);
      const fileName = path.parse(item.name).name;
      const fileExt = path.extname(item.name).slice(1);
      const fileSize = (fileStats.size / 1024).toFixed(3);
      
      console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
    }
  }
}

readFolder(folderPath);