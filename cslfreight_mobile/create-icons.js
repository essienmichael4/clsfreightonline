const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const width = 1088;
const height = 1088;

// Create a simple blue square with text overlay (using SVG)
const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#6496C8"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="120" fill="white" font-family="Arial">CSL</text>
</svg>
`;

const assetsDir = path.join(__dirname, 'src', 'assets');

Promise.all([
  sharp(Buffer.from(svg)).png().toFile(path.join(assetsDir, 'icon.png')),
  sharp(Buffer.from(svg)).png().toFile(path.join(assetsDir, 'adaptive-icon.png'))
]).then(() => {
  console.log('Square placeholder images created successfully');
  process.exit(0);
}).catch(err => {
  console.error('Error creating images:', err);
  process.exit(1);
});
