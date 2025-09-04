const puppeteer = require('puppeteer');

async function getColors() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log('Extracting colors from Monica\'s site...');
  await page.goto('https://www.monicaleggett.com/', { 
    waitUntil: 'networkidle2',
    timeout: 60000 
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Extract computed styles from various elements
  const colors = await page.evaluate(() => {
    const foundColors = new Set();
    
    // Get all elements
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const bgColor = styles.backgroundColor;
      const color = styles.color;
      
      // Convert rgb to hex
      const rgbToHex = (rgb) => {
        if (!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return null;
        const match = rgb.match(/\d+/g);
        if (!match) return null;
        const hex = '#' + match.slice(0, 3).map(x => {
          const hex = parseInt(x).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('');
        return hex.toUpperCase();
      };
      
      const bgHex = rgbToHex(bgColor);
      const textHex = rgbToHex(color);
      
      // Filter out white, black, and very light grays
      if (bgHex && bgHex !== '#FFFFFF' && bgHex !== '#000000' && !bgHex.startsWith('#F')) {
        foundColors.add(bgHex);
      }
      if (textHex && textHex !== '#FFFFFF' && textHex !== '#000000' && textHex !== '#333333') {
        foundColors.add(textHex);
      }
    });
    
    return Array.from(foundColors);
  });
  
  console.log('\n=== UNIQUE COLORS FOUND ===');
  const sorted = colors.sort();
  sorted.forEach(color => console.log(color));
  
  // Also look for specific color patterns in her header/nav
  const headerColors = await page.evaluate(() => {
    const colors = {};
    
    // Check header/nav area
    const header = document.querySelector('header, nav, [data-testid*="header"]');
    if (header) {
      const styles = window.getComputedStyle(header);
      colors.headerBg = styles.backgroundColor;
    }
    
    // Check buttons
    const button = document.querySelector('button, a[role="button"], [data-testid*="button"]');
    if (button) {
      const styles = window.getComputedStyle(button);
      colors.buttonBg = styles.backgroundColor;
      colors.buttonText = styles.color;
    }
    
    // Check any teal/blue/green elements
    const coloredElements = document.querySelectorAll('[style*="background"], [style*="color"]');
    const brandColors = [];
    
    coloredElements.forEach(el => {
      const style = el.getAttribute('style');
      if (style) {
        // Extract hex colors from inline styles
        const hexMatch = style.match(/#[0-9A-Fa-f]{6}/g);
        if (hexMatch) {
          hexMatch.forEach(hex => brandColors.push(hex.toUpperCase()));
        }
        // Extract rgb colors
        const rgbMatch = style.match(/rgb\([^)]+\)/g);
        if (rgbMatch) {
          rgbMatch.forEach(rgb => brandColors.push(rgb));
        }
      }
    });
    
    colors.brandColors = [...new Set(brandColors)];
    return colors;
  });
  
  console.log('\n=== SPECIFIC ELEMENTS ===');
  console.log('Header/Nav:', headerColors.headerBg);
  console.log('Buttons:', headerColors.buttonBg, headerColors.buttonText);
  console.log('Brand Colors from inline styles:', headerColors.brandColors);
  
  await browser.close();
}

getColors().catch(console.error);