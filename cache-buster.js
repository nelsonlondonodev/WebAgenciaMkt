const fs = require('fs');
const path = require('path');

const distPath = __dirname;
const version = Date.now();

console.log('Starting cache busting in root directory...');

// Find all HTML files in the dist directory
fs.readdir(distPath, (err, files) => {
  if (err) {
    console.error('Error reading dist directory:', err);
    return;
  }

  const htmlFiles = files.filter(file => file.endsWith('.html'));

  if (htmlFiles.length === 0) {
    console.log('No HTML files found in dist directory. Nothing to do.');
    return;
  }

  htmlFiles.forEach(file => {
    const filePath = path.join(distPath, file);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading ${file}:`, err);
        return;
      }

      // The regex looks for src/href attributes pointing to the specific files.
      // It handles paths like "./bundle.min.js" or "bundle.min.js".
      const regex = new RegExp(
        '(src|href)="\\.?/?(bundle\\.min\\.js|output\\.css)"',
        'g'
      );

      const updatedData = data.replace(regex, (match, attribute, filename) => {
        const newUrl = `${attribute}="./${filename}?v=${version}"`;
        console.log(`In ${file}, updated ${filename} to ${filename}?v=${version}`);
        return newUrl;
      });

      fs.writeFile(filePath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing updated ${file}:`, err);
          return;
        }
        console.log(`Cache busting complete for ${file}.`);
      });
    });
  });
});
