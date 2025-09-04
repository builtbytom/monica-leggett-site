import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function checkAllSlides() {
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1400, height: 900 }
  });
  
  const page = await browser.newPage();
  
  console.log('🌐 Opening Monica\'s site...');
  await page.goto('http://localhost:4322', { waitUntil: 'networkidle0' });
  
  // Wait for carousel to load
  await page.waitForSelector('.hero-slide', { timeout: 5000 });
  
  const slides = ['Book', 'Personal Coaching', 'Mentor Coaching', 'Masterminds'];
  
  for (let i = 0; i < slides.length; i++) {
    console.log(`\n📸 Checking ${slides[i]} slide...`);
    
    // Show specific slide
    await page.evaluate((slideIndex) => {
      // Hide all slides
      document.querySelectorAll('.hero-slide').forEach(s => {
        s.style.display = 'none';
      });
      // Show target slide
      const targetSlide = document.querySelectorAll('.hero-slide')[slideIndex];
      if (targetSlide) {
        targetSlide.style.display = 'block';
      }
    }, i);
    
    await new Promise(r => setTimeout(r, 500));
    
    // Take screenshot of just this slide
    const carousel = await page.$('section');
    if (carousel) {
      await carousel.screenshot({
        path: path.join(__dirname, `../public/slide-${i}-${slides[i].toLowerCase().replace(' ', '-')}.png`)
      });
    }
    
    // Get info about this slide's image
    const imageInfo = await page.evaluate((index) => {
      const slide = document.querySelectorAll('.hero-slide')[index];
      if (!slide) return null;
      
      const img = slide.querySelector('img');
      if (!img) return null;
      
      const rect = img.getBoundingClientRect();
      const container = img.closest('div[class*="relative"]');
      const containerRect = container ? container.getBoundingClientRect() : null;
      
      return {
        src: img.src.split('/').pop(),
        naturalSize: `${img.naturalWidth}x${img.naturalHeight}`,
        displaySize: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        containerSize: containerRect ? `${Math.round(containerRect.width)}x${Math.round(containerRect.height)}` : 'N/A',
        aspectRatio: (img.naturalWidth/img.naturalHeight).toFixed(2),
        hasObjectCover: img.classList.contains('object-cover'),
        isVertical: img.naturalHeight > img.naturalWidth
      };
    }, i);
    
    if (imageInfo) {
      console.log(`   📷 ${imageInfo.src}`);
      console.log(`      Natural: ${imageInfo.naturalSize} (ratio: ${imageInfo.aspectRatio})`);
      console.log(`      Display: ${imageInfo.displaySize}`);
      console.log(`      Container: ${imageInfo.containerSize}`);
      console.log(`      Vertical: ${imageInfo.isVertical ? 'YES' : 'NO'}`);
      console.log(`      Object-cover: ${imageInfo.hasObjectCover ? '⚠️ YES (may crop)' : '✅ NO'}`);
    }
  }
  
  await browser.close();
  console.log('\n✅ All slide screenshots saved to public/ folder');
}

checkAllSlides();