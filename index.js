const fs = require('fs');
const path = require('path');

function listFiles(directoryPath, baseDir = '', result = []) {
  const items = fs.readdirSync(directoryPath);

  items.forEach(item => {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      const subDir = baseDir === '' ? item : path.join(baseDir, item);
      listFiles(itemPath, subDir, result);
    } else if (item.endsWith('.java')) {
      const relativePath = path.join(baseDir, item);
      result.push(relativePath);
    }
  });

  return result;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Please provide a path to project directory.');
} else {
  const projectPath = path.resolve(args[0]);
  const srcPath = path.join(projectPath);
  const file = listFiles(srcPath);
  console.log('Java files in project:');
  file.forEach(file => console.log(file.replace(srcPath + '/', '')));

  const filePath = 'files.txt';
  fs.writeFileSync(filePath, file.map(file => file.replace(srcPath + '/', '')).join('\n'));
  console.log('Java files paths have been saved to', filePath);
}
