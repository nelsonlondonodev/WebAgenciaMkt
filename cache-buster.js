const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
const version = Date.now();

fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading index.html:', err);
    return;
  }

  console.log('Starting cache busting...');

  // Correctly create a RegExp object.
  // The regex now correctly captures the attribute (src or href) and the filename.
  const regex = new RegExp(
    '(src|href)="\\./(bundle\\.min\\.js|output\\.css)"',
    'g'
  );

  const updatedData = data.replace(regex, (match, attribute, filename) => {
    const newUrl = `${attribute}="./${filename}?v=${version}"`;
    console.log(`Updated ${filename} to ${filename}?v=${version}`);
    return newUrl;
  });

  fs.writeFile(indexPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing updated index.html:', err);
      return;
    }
    console.log('Cache busting complete. index.html updated successfully.');
  });
});
