import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Better coach/mentor images from Unsplash
const betterCoachImages = [
  {
    // Professional woman in business attire, confident pose
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    filename: 'monica-mentor-coaching-better.jpg',
    description: 'Professional woman coach'
  },
  {
    // Two people in coaching conversation
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    filename: 'monica-coaching-conversation.jpg',
    description: 'Coaching conversation'
  },
  {
    // Professional woman speaking/teaching
    url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80',
    filename: 'monica-speaking.jpg',
    description: 'Woman presenting/teaching'
  }
];

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', 'public', 'images', filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✅ Downloaded: ${filename}`);
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      }
    }).on('error', (err) => {
      console.error(`❌ Failed to download ${filename}:`, err);
      reject(err);
    });
  });
}

async function getBetterImages() {
  console.log('🎯 Getting better coach/mentor images...\n');
  
  for (const img of betterCoachImages) {
    console.log(`📥 Downloading: ${img.description}`);
    try {
      await downloadImage(img.url, img.filename);
    } catch (err) {
      console.error(`Failed: ${err.message}`);
    }
  }
  
  console.log('\n🔄 Replacing the nurse image...');
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  
  // Backup old mentor coaching image
  const oldPath = path.join(imagesDir, 'monica-mentor-coaching.jpg');
  const backupPath = path.join(imagesDir, 'monica-mentor-coaching-nurse.jpg');
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, backupPath);
    console.log('📦 Backed up nurse image');
  }
  
  // Use the professional woman image for mentor coaching
  const newPath = path.join(imagesDir, 'monica-mentor-coaching-better.jpg');
  const finalPath = path.join(imagesDir, 'monica-mentor-coaching.jpg');
  if (fs.existsSync(newPath)) {
    fs.renameSync(newPath, finalPath);
    console.log('✅ Replaced with professional coach image');
  }
  
  console.log('\n✨ Done! Better professional coaching images installed.');
}

getBetterImages();