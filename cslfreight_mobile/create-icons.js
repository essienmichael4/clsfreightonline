const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'src', 'assets');
const sourceIconPath = path.join(assetsDir, 'icon.png'); // Your 512x512 icon

// Check if source icon exists
if (!fs.existsSync(sourceIconPath)) {
  console.error('Error: icon.png not found in src/assets/');
  process.exit(1);
}

Promise.all([
  // Create adaptive-icon.png for Android (copy the icon.png)
  sharp(sourceIconPath).resize(1088, 1088, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toFile(path.join(assetsDir, 'adaptive-icon.png'))
]).then(() => {
  console.log('✅ Adaptive icon generated successfully');
  process.exit(0);
}).catch(err => {
  console.error('Error creating adaptive icon:', err);
  process.exit(1);
});
