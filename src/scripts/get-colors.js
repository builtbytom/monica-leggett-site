const puppeteer = require('puppeteer');

async function getColors() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log('Extracting colors from Monica\'s site...');
  await page.goto('https://www.monicaleggett.com/', { 
    waitUntil: 'networkidle2',
    timeout: 60000 
  });
  
  // Extract computed styles from various elements
  const colors = await page.evaluate(() => {
    const colorMap = {};
    
    // Get colors from different elements
    const elements = {
      'nav-links': document.querySelector('nav a'),
      'headings': document.querySelector('h1, h2'),
      'buttons': document.querySelector('button, a[role="button"]'),
      'backgrounds': document.querySelector('[style*="background"]'),
      'text': document.querySelector('p'),
    };
    
    // Also check for any elements with inline styles
    const allElements = document.querySelectorAll('*');
    const foundColors = new Set();
    
    allElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const bgColor = styles.backgroundColor;
      const color = styles.color;
      const borderColor = styles.borderColor;
      
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
      const borderHex = rgbToHex(borderColor);
      
      if (bgHex && bgHex !== '#FFFFFF' && bgHex !== '#000000') foundColors.add(bgHex);
      if (textHex && textHex !== '#FFFFFF' && textHex !== '#000000') foundColors.add(textHex);
      if (borderHex && borderHex !== '#FFFFFF' && borderHex !== '#000000') foundColors.add(borderHex);
    });
    
    return Array.from(foundColors);
  });
  
  console.log('\n=== COLORS FOUND ===');
  colors.forEach(color => console.log(color));
  
  await browser.close();
  return colors;
}

getColors().catch(console.error);