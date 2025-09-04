import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create public/images directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filePath);
    
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`❌ Failed to download ${filename}:`, err);
      reject(err);
    });
  });
}

async function grabImages() {
  console.log('🚀 Starting image extraction from Monica\'s site...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('📄 Loading https://www.monicaleggett.com...');
    await page.goto('https://www.monicaleggett.com', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('\n🔍 Looking for key images...\n');
    
    // Get all images with their details
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        alt: img.alt || '',
        width: img.naturalWidth,
        height: img.naturalHeight,
        className: img.className || ''
      })).filter(img => img.width > 100 && img.height > 100); // Filter tiny images
    });
    
    console.log(`Found ${images.length} images on the page\n`);
    
    // Priority images to find
    const imagesToDownload = [
      { pattern: /monica.*leggett|leggett.*monica|profile|headshot|about/i, filename: 'monica-leggett-portrait.jpg', found: false },
      { pattern: /doubtful.*decisive|decisive.*doubtful|book.*cover/i, filename: 'doubtful-to-decisive-book.jpg', found: false },
      { pattern: /coaching.*session|session.*coaching/i, filename: 'monica-coaching-session.jpg', found: false },
      { pattern: /mentor|mentoring/i, filename: 'monica-mentor-coaching.jpg', found: false },
      { pattern: /mastermind|group/i, filename: 'monica-mastermind-group.jpg', found: false }
    ];
    
    // Try to match images to our needed files
    for (const img of images) {
      const searchText = `${img.src} ${img.alt} ${img.className}`.toLowerCase();
      
      for (const target of imagesToDownload) {
        if (!target.found && target.pattern.test(searchText)) {
          console.log(`Matched ${target.filename}:`);
          console.log(`  URL: ${img.src}`);
          console.log(`  Alt: ${img.alt}`);
          console.log(`  Size: ${img.width}x${img.height}`);
          
          try {
            await downloadImage(img.src, target.filename);
            target.found = true;
          } catch (err) {
            console.error(`Failed to download: ${err.message}`);
          }
          break;
        }
      }
    }
    
    // Download the largest images as fallbacks
    console.log('\n📊 Top 5 largest images as potential fallbacks:\n');
    const sortedImages = images.sort((a, b) => (b.width * b.height) - (a.width * a.height));
    
    for (let i = 0; i < Math.min(5, sortedImages.length); i++) {
      const img = sortedImages[i];
      console.log(`${i+1}. ${img.width}x${img.height} - ${img.alt || 'No alt text'}`);
      console.log(`   ${img.src}\n`);
      
      // Download as generic fallback images if needed
      if (!imagesToDownload.some(t => t.found)) {
        const fallbackName = `monica-image-${i+1}.jpg`;
        try {
          await downloadImage(img.src, fallbackName);
        } catch (err) {
          console.error(`Failed to download fallback: ${err.message}`);
        }
      }
    }
    
    // Report which images we still need
    console.log('\n📋 Status Report:');
    for (const target of imagesToDownload) {
      console.log(`${target.found ? '✅' : '❌'} ${target.filename}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✨ Done!');
  }
}

grabImages();