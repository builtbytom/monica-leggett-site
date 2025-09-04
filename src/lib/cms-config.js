/**
 * CMS Configuration for Monica Leggett Site
 * This maps all editable content to Tom's portal CMS
 */

export const cmsConfig = {
  // Portal endpoint (Tom's CMS)
  portalUrl: 'https://ibuildcalm.com/portal',
  siteId: 'monica-leggett',
  
  // Editable content mapping
  content: {
    // HERO CAROUSEL - All 4 slides
    hero: {
      book: {
        title: 'hero-book-title',
        subtitle: 'hero-book-subtitle', 
        description: 'hero-book-description',
        cta1: 'hero-book-cta1',
        cta2: 'hero-book-cta2',
        image: 'hero-book-image'
      },
      coaching: {
        title: 'hero-coaching-title',
        subtitle: 'hero-coaching-subtitle',
        description: 'hero-coaching-description', 
        cta1: 'hero-coaching-cta1',
        cta2: 'hero-coaching-cta2',
        image: 'hero-coaching-image'
      },
      mentor: {
        title: 'hero-mentor-title',
        subtitle: 'hero-mentor-subtitle',
        description: 'hero-mentor-description',
        cta1: 'hero-mentor-cta1', 
        cta2: 'hero-mentor-cta2',
        image: 'hero-mentor-image'
      },
      mastermind: {
        title: 'hero-mastermind-title',
        subtitle: 'hero-mastermind-subtitle',
        description: 'hero-mastermind-description',
        cta1: 'hero-mastermind-cta1',
        cta2: 'hero-mastermind-cta2',
        image: 'hero-mastermind-image'
      }
    },
    
    // HOMEPAGE SECTIONS
    about: {
      title: 'about-title',
      subtitle: 'about-subtitle',
      description1: 'about-description1',
      description2: 'about-description2',
      cta: 'about-cta',
      image: 'about-image'
    },
    
    services: {
      sectionTitle: 'services-section-title',
      sectionSubtitle: 'services-section-subtitle',
      book: {
        title: 'service-book-title',
        description: 'service-book-description',
        cta: 'service-book-cta'
      },
      coaching: {
        title: 'service-coaching-title',
        description: 'service-coaching-description',
        cta: 'service-coaching-cta'
      },
      mentor: {
        title: 'service-mentor-title',
        description: 'service-mentor-description',
        cta: 'service-mentor-cta'
      },
      mastermind: {
        title: 'service-mastermind-title',
        description: 'service-mastermind-description',
        cta: 'service-mastermind-cta'
      }
    },
    
    leadMagnet: {
      title: 'lead-magnet-title',
      description: 'lead-magnet-description',
      buttonText: 'lead-magnet-button',
      emailPlaceholder: 'lead-magnet-email-placeholder'
    },
    
    testimonials: {
      sectionTitle: 'testimonials-title',
      items: 'testimonials-list' // This will be a repeatable field in CMS
    },
    
    // NAVIGATION
    navigation: {
      logo: 'nav-logo-text',
      menuItems: 'nav-menu-items',
      ctaButton: 'nav-cta-button'
    },
    
    // FOOTER
    footer: {
      about: 'footer-about',
      newsletterTitle: 'footer-newsletter-title',
      newsletterDescription: 'footer-newsletter-description',
      newsletterButton: 'footer-newsletter-button',
      copyright: 'footer-copyright'
    }
  },
  
  // Field types for CMS interface
  fieldTypes: {
    'hero-*-title': 'text',
    'hero-*-subtitle': 'text',
    'hero-*-description': 'textarea',
    'hero-*-cta*': 'text',
    'hero-*-image': 'image',
    'about-description*': 'richtext',
    'service-*-description': 'textarea',
    'testimonials-list': 'repeater',
    'nav-menu-items': 'navigation'
  },
  
  // Monica-specific settings
  userSettings: {
    autoSave: true,           // Auto-save every 30 seconds
    previewMode: true,         // Always show preview
    simplifiedEditor: true,    // Hide advanced options
    largeText: true,          // Bigger fonts in editor
    confirmPublish: true      // Confirm before publishing
  }
};

/**
 * Helper to get CMS value
 * In production, this fetches from Tom's portal
 * In dev, uses the default content
 */
export async function getCMSContent(key, defaultValue) {
  // In production, fetch from portal API
  if (import.meta.env.PROD) {
    try {
      const response = await fetch(`${cmsConfig.portalUrl}/api/content/${cmsConfig.siteId}/${key}`);
      if (response.ok) {
        const data = await response.json();
        return data.value || defaultValue;
      }
    } catch (error) {
      console.error(`Failed to fetch CMS content for ${key}:`, error);
    }
  }
  
  // Return default in dev or on error
  return defaultValue;
}

/**
 * Initialize CMS editing capabilities
 * This adds the edit overlay when Monica is logged in
 */
export function initCMSEditor() {
  if (typeof window === 'undefined') return;
  
  // Check if user is logged into portal
  const isEditor = window.location.search.includes('edit=true') || 
                   document.cookie.includes('portal_session=');
  
  if (isEditor) {
    // Add edit buttons to all CMS fields
    document.querySelectorAll('[data-cms]').forEach(element => {
      const fieldId = element.getAttribute('data-cms');
      element.style.position = 'relative';
      element.classList.add('cms-editable');
      
      // Add hover effect
      element.addEventListener('mouseenter', () => {
        element.style.outline = '2px dashed #1A3C5D';
        element.style.outlineOffset = '4px';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.outline = 'none';
      });
      
      // Add click handler
      element.addEventListener('click', (e) => {
        if (e.shiftKey) { // Shift+click to edit
          e.preventDefault();
          openCMSEditor(fieldId, element.textContent);
        }
      });
    });
    
    // Add editor notice
    const notice = document.createElement('div');
    notice.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1A3C5D;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: system-ui;
        font-size: 14px;
        z-index: 9999;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      ">
        ✏️ Edit Mode Active - Shift+Click any text to edit
      </div>
    `;
    document.body.appendChild(notice);
  }
}

/**
 * Open the CMS editor modal
 */
function openCMSEditor(fieldId, currentValue) {
  // This would open Monica's simple edit modal
  const modal = window.open(
    `${cmsConfig.portalUrl}/edit/${cmsConfig.siteId}/${fieldId}?value=${encodeURIComponent(currentValue)}`,
    'cms-editor',
    'width=800,height=600'
  );
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initCMSEditor);
}