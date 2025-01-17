const fs = require('fs');
const path = require('path');

const sourceFolderPath = __dirname;
const mergedFolderPath = path.join(__dirname, 'project-dist');
const bundleFilePath = path.join(mergedFolderPath, 'bundle.css');

async function mergeDirectory() {
  await fs.promises.access(mergedFolderPath, fs.constants.F_OK).catch(() => {
    fs.promises.mkdir(mergedFolderPath, { recursive: true });
  });

  await fs.promises.writeFile(bundleFilePath, '');

  async function readFolder(folderPath) {
    const folderContent = await fs.promises.readdir(folderPath, { withFileTypes: true });

    for (const item of folderContent) {
      const filePath = path.join(folderPath, item.name);

      if (path.extname(item.name) === '.css') {

        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        await fs.promises.appendFile(bundleFilePath, fileContent + '\n');
        
      } else if (item.isDirectory()) {
        await readFolder(filePath);
      }
    }
  }

  await readFolder(sourceFolderPath);
}

mergeDirectory(sourceFolderPath)

