import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function screenshotCarousel() {
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1400, height: 900 }
  });
  
  const page = await browser.newPage();
  
  console.log('🌐 Opening Monica\'s site...');
  await page.goto('http://localhost:4322', { waitUntil: 'networkidle0' });
  
  // Wait for carousel to load
  await page.waitForSelector('.hero-slide', { timeout: 5000 });
  
  // Take full page screenshot
  console.log('📸 Taking full page screenshot...');
  await page.screenshot({
    path: path.join(__dirname, '../public/carousel-full-page.png'),
    fullPage: false
  });
  
  // Get carousel section screenshot
  const carousel = await page.$('section');
  if (carousel) {
    console.log('📸 Taking carousel section screenshot...');
    await carousel.screenshot({
      path: path.join(__dirname, '../public/carousel-section.png')
    });
  }
  
  // Check what's visible and sizes
  const analysis = await page.evaluate(() => {
    const slides = document.querySelectorAll('.hero-slide');
    const images = document.querySelectorAll('.hero-slide img');
    
    const slideInfo = Array.from(slides).map((slide, i) => ({
      index: i,
      isActive: slide.classList.contains('active'),
      display: window.getComputedStyle(slide).display,
      opacity: window.getComputedStyle(slide).opacity
    }));
    
    const imageInfo = Array.from(images).map((img, i) => {
      const rect = img.getBoundingClientRect();
      const container = img.closest('div[class*="relative"]');
      const containerRect = container ? container.getBoundingClientRect() : null;
      
      return {
        index: i,
        src: img.src.split('/').pop(),
        naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
        displaySize: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        containerSize: containerRect ? `${Math.round(containerRect.width)}x${Math.round(containerRect.height)}` : 'N/A',
        isVisible: rect.width > 0 && rect.height > 0,
        isCropped: img.classList.contains('object-cover')
      };
    });
    
    return { slides: slideInfo, images: imageInfo };
  });
  
  console.log('\n📊 Carousel Analysis:');
  console.log('\nSlides:');
  analysis.slides.forEach(s => {
    console.log(`  Slide ${s.index}: ${s.isActive ? '✅ ACTIVE' : '❌ Hidden'} (display: ${s.display}, opacity: ${s.opacity})`);
  });
  
  console.log('\nImages:');
  analysis.images.forEach(img => {
    if (img.isVisible) {
      console.log(`\n  📷 ${img.src}`);
      console.log(`     Natural: ${img.naturalSize}`);
      console.log(`     Display: ${img.displaySize}`);
      console.log(`     Container: ${img.containerSize}`);
      console.log(`     Cropped: ${img.isCropped ? '⚠️ YES (heads may be cut off!)' : '✅ NO'}`);
    }
  });
  
  await browser.close();
  console.log('\n✅ Screenshots saved to public/ folder');
  console.log('   - carousel-full-page.png');
  console.log('   - carousel-section.png');
}

screenshotCarousel();