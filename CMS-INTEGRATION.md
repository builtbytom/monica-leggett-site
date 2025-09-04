# Monica Leggett Site - CMS Integration Guide

## ✅ CMS-Ready Status

**EVERYTHING IS CMS-EDITABLE** - We've built this right from the start!

---

## 🎯 How Monica Edits Content

1. **Monica logs into:** `https://ibuildcalm.com/portal`
2. **Clicks:** "Edit Monica Leggett Site"
3. **She sees:** A simple dashboard with sections
4. **Shift+Click:** Any text on her live site to edit inline

---

## 📝 What's Editable (Everything!)

### Hero Carousel (All 4 Slides)
Each slide has these editable fields:
- Title
- Subtitle  
- Description
- Button 1 text
- Button 2 text
- Image

**CMS IDs:**
```
hero-book-title, hero-book-subtitle, hero-book-description...
hero-coaching-title, hero-coaching-subtitle...
hero-mentor-title, hero-mentor-subtitle...
hero-mastermind-title, hero-mastermind-subtitle...
```

### Homepage Sections
- **About Monica**: Title, subtitle, both paragraphs, CTA button, image
- **Services Cards**: Title and description for each service
- **Lead Magnet**: Heading, description, button text
- **Testimonials**: Full list with names, quotes, titles

### Navigation & Footer
- Logo text
- Menu items
- CTA button text
- Footer about text
- Newsletter signup text

---

## 🏗️ Technical Implementation

### 1. Every Editable Element Has:
```html
<element data-cms="unique-field-id" data-cms-type="text">
  Default content
</element>
```

### 2. Field Naming Convention:
```
section-subsection-field
Examples:
- hero-book-title
- service-coaching-description  
- footer-newsletter-button
```

### 3. Field Types:
- `text` - Single line (titles, buttons)
- `textarea` - Multi-line (descriptions)
- `richtext` - Blog posts with formatting
- `image` - Image uploads with auto-optimization
- `repeater` - Lists like testimonials

---

## 👵 Monica-Friendly Features

### Auto-Save
- Saves every 30 seconds
- Never loses work

### Big Text Mode
- Larger fonts in editor
- Easy to read

### Preview Before Publish
- See changes before going live
- Undo button if needed

### Simple Image Upload
- Drag and drop
- Auto-resizes
- Auto-optimizes

---

## 🔗 Portal Integration Points

### 1. Content Fetching
```javascript
// Production: Fetches from Tom's portal
// Dev: Uses default content
getCMSContent('hero-book-title', 'Doubtful to Decisive:')
```

### 2. Edit Mode Detection
```javascript
// Monica is in edit mode when:
- URL has ?edit=true
- Portal session cookie exists
- She's logged into Tom's portal
```

### 3. Visual Edit Indicators
When Monica is logged in:
- Hover over any text shows edit outline
- Shift+Click opens editor
- Edit mode banner appears

---

## 📦 Files Involved

### Core CMS Files:
- `/src/lib/cms-config.js` - Configuration and field mapping
- `/src/components/CMSContent.astro` - Wrapper component
- All page files have `data-cms` attributes

### Components with CMS:
- `/src/components/HeroCarousel.astro` - All slides editable
- `/src/layouts/BaseLayout.astro` - Nav and footer
- `/src/pages/index.astro` - All homepage content

---

## 🚀 Adding New Editable Content

To make any new content editable:

1. **Add the attribute:**
```html
<p data-cms="new-field-id">Content</p>
```

2. **Register in cms-config.js:**
```javascript
content: {
  newSection: {
    field: 'new-field-id'
  }
}
```

3. **That's it!** Monica can now edit it.

---

## 🔒 Security

- Monica can ONLY edit text/images
- Cannot break layout
- Cannot access code
- Cannot delete pages
- All changes are versioned

---

## 📱 Mobile Editing

Monica can edit from her iPad:
- Larger touch targets
- Simplified interface
- Voice-to-text works
- Auto-save more frequent (15 seconds)

---

## ⚠️ Important Notes

1. **ALL content is editable** - We did this right from the start
2. **No retrofitting needed** - Built with CMS in mind
3. **Monica owns her content** - Stored in her portal account
4. **No monthly CMS fees** - Uses Tom's portal system

---

## 🎯 Next Steps for Tom

1. Create Monica's account in your portal
2. Add her site configuration
3. Map all the field IDs
4. Test edit mode
5. Record training video for Monica

---

*This is WAY better than retrofitting CMS later. Good call on doing this now!*