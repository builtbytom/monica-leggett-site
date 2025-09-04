import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Better, more relevant images from Unsplash (free, no attribution required)
const betterImages = [
  {
    // Two people in conversation, professional setting - perfect for personal coaching
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    filename: 'monica-coaching-session-new.jpg',
    description: 'Personal coaching session'
  },
  {
    // Professional woman mentoring/teaching - great for mentor coaching
    url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80',
    filename: 'monica-mentor-coaching-new.jpg',
    description: 'Mentor coaching'
  },
  {
    // Group of professionals in discussion - perfect for masterminds
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    filename: 'monica-mastermind-group-new.jpg',
    description: 'Mastermind group'
  }
];

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '..', 'public', 'images', filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
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

async function downloadBetterImages() {
  console.log('🎨 Downloading better, more relevant images for Monica\'s services...\n');
  
  for (const img of betterImages) {
    console.log(`📥 Downloading: ${img.description}`);
    console.log(`   From: ${img.url}`);
    try {
      await downloadImage(img.url, img.filename);
    } catch (err) {
      console.error(`Failed: ${err.message}`);
    }
  }
  
  console.log('\n🔄 Backing up old images...');
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  
  // Backup old images
  const filesToBackup = [
    'monica-coaching-session.jpg',
    'monica-mentor-coaching.jpg',
    'monica-mastermind-group.jpg'
  ];
  
  for (const file of filesToBackup) {
    const oldPath = path.join(imagesDir, file);
    const backupPath = path.join(imagesDir, file.replace('.jpg', '-old.jpg'));
    
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, backupPath);
      console.log(`📦 Backed up: ${file} → ${file.replace('.jpg', '-old.jpg')}`);
    }
  }
  
  console.log('\n🎯 Renaming new images to replace old ones...');
  
  // Rename new images to replace old ones
  const filesToRename = [
    { from: 'monica-coaching-session-new.jpg', to: 'monica-coaching-session.jpg' },
    { from: 'monica-mentor-coaching-new.jpg', to: 'monica-mentor-coaching.jpg' },
    { from: 'monica-mastermind-group-new.jpg', to: 'monica-mastermind-group.jpg' }
  ];
  
  for (const rename of filesToRename) {
    const fromPath = path.join(imagesDir, rename.from);
    const toPath = path.join(imagesDir, rename.to);
    
    if (fs.existsSync(fromPath)) {
      fs.renameSync(fromPath, toPath);
      console.log(`✅ Replaced: ${rename.to}`);
    }
  }
  
  console.log('\n✨ Done! Better images installed for all services.');
  console.log('🌐 Check http://localhost:4322 to see the improved carousel.');
}

downloadBetterImages();