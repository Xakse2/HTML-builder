const fs = require('fs');
const path = require('path');

async function buildPage() {
  const projectDist = path.join(__dirname, 'project-dist');
  const templateFile = path.join(__dirname, 'template.html');
  const componentsDir = path.join(__dirname, 'components');
  const stylesDir = path.join(__dirname, 'styles');
  const assetsDir = path.join(__dirname, 'assets');
  const outputHtml = path.join(projectDist, 'index.html');
  const outputCss = path.join(projectDist, 'style.css');
  const outputAssets = path.join(projectDist, 'assets');

  await fs.promises.mkdir(projectDist, { recursive: true });

  let templateContent = await fs.promises.readFile(templateFile, 'utf-8');
  const tags = templateContent.match(/{{\w+}}/g) || [];

  for (const tag of tags) {
    const tagName = tag.slice(2, -2);
    const componentPath = path.join(componentsDir, `${tagName}.html`);

    const componentContent = await fs.promises.readFile(componentPath, 'utf-8');
    templateContent = templateContent.replace(new RegExp(tag, 'g'), componentContent);
  }

  await fs.promises.writeFile(outputHtml, templateContent);

  const styleFiles = await fs.promises.readdir(stylesDir);
    const cssContents = await Promise.all(
        styleFiles
            .filter(file => path.extname(file) === '.css')
            .map(file => fs.promises.readFile(path.join(stylesDir, file), 'utf-8'))
    );
  
  await fs.promises.writeFile(outputCss, cssContents.join('\n'));
  
  async function copyDir(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.promises.copyFile(srcPath, destPath);
        }
    }
}
  
await copyDir(assetsDir, outputAssets);

}

buildPage();