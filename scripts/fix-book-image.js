import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagePath = path.join(__dirname, '..', 'public', 'images', 'doubtful-to-decisive-book.jpg');
const outputPath = path.join(__dirname, '..', 'public', 'images', 'doubtful-to-decisive-book-transparent.png');

// Try to remove white background
async function removeBackground() {
  try {
    await sharp(imagePath)
      .removeAlpha() // Remove any existing alpha channel
      .ensureAlpha() // Add new alpha channel
      .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } }) // Transparent background
      .png()
      .toFile(outputPath);
    
    console.log('Created transparent version at:', outputPath);
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

removeBackground();