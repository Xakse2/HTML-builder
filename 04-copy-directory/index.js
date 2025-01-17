const fs = require('fs');
const path = require('path');

const sourceFolderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

async function copyDirectory() {
  await fs.promises.access(copyFolderPath, fs.constants.F_OK).catch(() => {
    fs.promises.mkdir(copyFolderPath, { recursive: true });
  });

  async function readFolder(folderPath) {
    const folderContent = await fs.promises.readdir(folderPath, { withFileTypes: true });

    for (const item of folderContent) {
      const filePath = path.join(folderPath, item.name);
      const copyPath = path.join(copyFolderPath, item.name);

      if (item.isFile()) {
        await fs.promises.copyFile(filePath, copyPath);
      } else if (item.isDirectory()) {
        await readFolder(filePath);
      }
    }
  }

  await readFolder(sourceFolderPath);
}

copyDirectory();
