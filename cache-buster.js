const fs = require('fs');
const path = require('path');

const distPath = __dirname;
const now = new Date();
const version = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}.${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

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


  // Add files from 'cv' directory
  const cvPath = path.join(distPath, 'cv');
  if (fs.existsSync(cvPath)) {
    const cvFiles = fs.readdirSync(cvPath).filter(file => file.endsWith('.html'));
    cvFiles.forEach(file => htmlFiles.push(path.join('cv', file)));
  }

  // Add footer component specifically to update its build version
  const footerPath = path.join(distPath, 'components', 'footer.html');
  if (fs.existsSync(footerPath)) {
    htmlFiles.push(path.join('components', 'footer.html'));
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

      // 1. Regular Cache Busting (JS/CSS)
      const regex = new RegExp(
        '(src|href)="((?:\\.\\./|\\./|/)?)(bundle\\.min\\.js|output\\.css|fontawesome\\.min\\.css)(?:\\?v=[0-9]*)?"',
        'g'
      );

      let updatedData = data.replace(regex, (match, attribute, prefix, filename) => {
        const newUrl = `${attribute}="/${filename}?v=${version}"`;
        console.log(`In ${file}, updated ${filename} to /${filename}?v=${version}`);
        return newUrl;
      });

      // 2. Build Version Injection (Footer only)
      if (file.includes('footer.html')) {
        const versionRegex = new RegExp('<span id="footer-build-version">.*?</span>', 'g');
        updatedData = updatedData.replace(versionRegex, `<span id="footer-build-version">v.${version}</span>`);
        console.log(`In ${file}, updated build version to v.${version}`);
      }

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
