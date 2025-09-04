import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function viewAndCapture() {
  const browser = await puppeteer.launch({ 
    headless: false,  // Show the browser
    defaultViewport: { width: 1400, height: 900 }
  });
  
  const page = await browser.newPage();
  
  console.log('🌐 Opening Monica\'s site...');
  await page.goto('http://localhost:4322', { waitUntil: 'networkidle0' });
  
  // Wait for carousel to load
  await page.waitForSelector('.hero-slide');
  
  // Take screenshots of each carousel slide
  const slides = ['Book', 'Personal Coaching', 'Mentor Coaching', 'Masterminds'];
  
  for (let i = 0; i < slides.length; i++) {
    console.log(`📸 Capturing ${slides[i]} slide...`);
    
    // Click the dot to navigate to the slide
    if (i > 0) {
      await page.click(`[data-dot="${i}"]`);
      await page.waitForTimeout(1000); // Wait for transition
    }
    
    // Take screenshot of the carousel area
    const carousel = await page.$('#hero-carousel');
    if (carousel) {
      await carousel.screenshot({
        path: path.join(__dirname, `../carousel-slide-${i}-${slides[i].toLowerCase().replace(' ', '-')}.png`)
      });
    }
  }
  
  // Also get info about the images
  const imageInfo = await page.evaluate(() => {
    const images = document.querySelectorAll('.hero-slide img');
    return Array.from(images).map((img, index) => ({
      slide: index,
      src: img.src,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      displayWidth: img.offsetWidth,
      displayHeight: img.offsetHeight,
      isVisible: img.offsetParent !== null
    }));
  });
  
  console.log('\n📊 Image Analysis:');
  imageInfo.forEach(info => {
    if (info.isVisible || info.slide === 0) {
      console.log(`\nSlide ${info.slide}: ${info.alt}`);
      console.log(`  Natural size: ${info.naturalWidth}x${info.naturalHeight}`);
      console.log(`  Display size: ${info.displayWidth}x${info.displayHeight}`);
      console.log(`  Aspect ratio: ${(info.naturalWidth/info.naturalHeight).toFixed(2)}`);
    }
  });
  
  // Keep browser open for manual inspection
  console.log('\n👀 Browser is open for your inspection.');
  console.log('📌 Navigate through the carousel to see the issues.');
  console.log('❌ Close the browser window when done.\n');
  
  // Wait for browser to be closed manually
  await new Promise(resolve => {
    browser.on('disconnected', resolve);
  });
}

viewAndCapture();