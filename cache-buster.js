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

  // Add files from 'guia' directory
  const guiaPath = path.join(distPath, 'guia');
  if (fs.existsSync(guiaPath)) {
    const guiaFiles = fs.readdirSync(guiaPath).filter(file => file.endsWith('.html'));
    guiaFiles.forEach(file => htmlFiles.push(path.join('guia', file)));
  }

  // Add files from 'nelson-londono' directory
  const nelsonPath = path.join(distPath, 'nelson-londono');
  if (fs.existsSync(nelsonPath)) {
    const nelsonFiles = fs.readdirSync(nelsonPath).filter(file => file.endsWith('.html'));
    nelsonFiles.forEach(file => htmlFiles.push(path.join('nelson-londono', file)));
  }

  // Add files from 'cv' directory
  const cvPath = path.join(distPath, 'cv');
  if (fs.existsSync(cvPath)) {
    const cvFiles = fs.readdirSync(cvPath).filter(file => file.endsWith('.html'));
    cvFiles.forEach(file => htmlFiles.push(path.join('cv', file)));
  }

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
      // It handles paths like "./bundle.min.js", "bundle.min.js", or "../output.css".
      const regex = new RegExp(
        '(src|href)="((?:\\.\\./|\\./|/)?)(bundle\\.min\\.js|output\\.css|fontawesome\\.min\\.css)(?:\\?v=[0-9]*)?"',
        'g'
      );

      const updatedData = data.replace(regex, (match, attribute, prefix, filename) => {
        // Forzamos ruta absoluta desde la raíz (/) para evitar fallos de resolución
        const newUrl = `${attribute}="/${filename}?v=${version}"`;
        console.log(`In ${file}, updated ${filename} to /${filename}?v=${version}`);
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
