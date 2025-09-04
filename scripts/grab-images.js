import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import https from 'https';
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
    const file = createWriteStream(filePath);
    
    https.get(url, (response) => {
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
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('📄 Loading https://www.monicaleggett.com...');
    await page.goto('https://www.monicaleggett.com', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for images to load
    await page.waitForTimeout(3000);
    
    console.log('\n🔍 Looking for key images...\n');
    
    // Find Monica's portrait/headshot
    const portraits = await page.$$eval('img', imgs => 
      imgs.filter(img => {
        const src = img.src.toLowerCase();
        const alt = (img.alt || '').toLowerCase();
        return (src.includes('monica') || alt.includes('monica')) &&
               (src.includes('portrait') || src.includes('headshot') || 
                src.includes('profile') || src.includes('leggett') ||
                alt.includes('portrait') || alt.includes('headshot'));
      }).map(img => ({
        src: img.src,
        alt: img.alt
      }))
    );
    
    if (portraits.length > 0) {
      console.log(`Found Monica's portrait: ${portraits[0].src}`);
      await downloadImage(portraits[0].src, 'monica-leggett-portrait.jpg');
    }
    
    // Find book cover
    const bookCovers = await page.$$eval('img', imgs => 
      imgs.filter(img => {
        const src = img.src.toLowerCase();
        const alt = (img.alt || '').toLowerCase();
        return src.includes('doubtful') || src.includes('decisive') || 
               src.includes('book') || alt.includes('doubtful') || 
               alt.includes('decisive') || alt.includes('book');
      }).map(img => ({
        src: img.src,
        alt: img.alt
      }))
    );
    
    if (bookCovers.length > 0) {
      console.log(`Found book cover: ${bookCovers[0].src}`);
      await downloadImage(bookCovers[0].src, 'doubtful-to-decisive-book.jpg');
    }
    
    // Get any coaching/session images
    const coachingImages = await page.$$eval('img', imgs => 
      imgs.filter(img => {
        const src = img.src.toLowerCase();
        const alt = (img.alt || '').toLowerCase();
        return src.includes('coaching') || src.includes('session') || 
               src.includes('mentor') || src.includes('mastermind') ||
               alt.includes('coaching') || alt.includes('session') ||
               alt.includes('mentor') || alt.includes('mastermind');
      }).map(img => ({
        src: img.src,
        alt: img.alt,
        type: img.src.includes('mentor') ? 'mentor' : 
              img.src.includes('mastermind') ? 'mastermind' : 'coaching'
      }))
    );
    
    for (const img of coachingImages) {
      const filename = `monica-${img.type}-session.jpg`;
      console.log(`Found ${img.type} image: ${img.src}`);
      await downloadImage(img.src, filename);
    }
    
    // Get all unique images from the page (fallback)
    const allImages = await page.$$eval('img', imgs => 
      imgs.filter(img => img.src && !img.src.includes('data:'))
          .map(img => ({
            src: img.src,
            alt: img.alt || '',
            width: img.naturalWidth,
            height: img.naturalHeight
          }))
          .filter(img => img.width > 200 && img.height > 200) // Filter tiny images
    );
    
    console.log(`\n📊 Found ${allImages.length} total images on the page`);
    console.log('Top 5 largest images:');
    
    const sortedImages = allImages.sort((a, b) => (b.width * b.height) - (a.width * a.height));
    for (let i = 0; i < Math.min(5, sortedImages.length); i++) {
      const img = sortedImages[i];
      console.log(`  ${i+1}. ${img.width}x${img.height} - ${img.alt || 'No alt text'}`);
      console.log(`     ${img.src}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✨ Done!');
  }
}

grabImages();