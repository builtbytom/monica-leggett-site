# Monica's CMS Setup Checklist - For Tom

## 🚀 Quick Setup Steps

### 1️⃣ Create Monica's Portal Account
Go to your Built by Tom portal admin and create:
- **Email:** monica@monicaleggett.com
- **Password:** Something simple (suggest: Monica2025!)
- **Role:** Editor (NOT Admin)
- **Site Access:** monica-leggett

### 2️⃣ Configure Site in Portal
Add this configuration to your portal:

```json
{
  "siteId": "monica-leggett",
  "siteName": "Monica Leggett Coaching",
  "liveUrl": "https://monicaleggett.com",
  "devUrl": "http://localhost:4321",
  "cmsSettings": {
    "autoSave": true,
    "autoSaveInterval": 30,
    "largeText": true,
    "simplifiedEditor": true,
    "confirmBeforePublish": true
  }
}
```

### 3️⃣ Test CMS Integration
1. Visit: http://localhost:4321/cms-test?edit=true
2. Verify edit mode activates
3. Test Shift+Click on editable content
4. Check portal connection

### 4️⃣ Monica's Login Process
Send Monica these simple instructions:

```
Hi Monica! Here's how to edit your website:

1. Go to: https://ibuildcalm.com/portal
2. Login with:
   Email: [her email]
   Password: [her password]
3. Click "Edit My Website"
4. Your site opens with editing enabled
5. Shift+Click any text to edit it
6. Changes save automatically
```

## 📝 All Editable Fields

### Homepage (/)
- Hero Carousel (4 slides - each has title, subtitle, description, 2 buttons, image)
- About Section (title, subtitle, 2 paragraphs, button, image)
- Services Cards (4 cards - each has title, description, button)
- Lead Magnet (title, description, button, email placeholder)
- Testimonials (repeatable list)

### Learning Center (/learning-center)
- Page title and intro
- Each article card (title, excerpt, category)
- Search placeholder text

### Individual Article Pages
- Article title
- Article description
- Full article content (rich text)
- Author bio
- CTA section

### Service Pages (4 pages)
- Hero section (title, subtitle, description)
- Service details (all text blocks)
- Benefits list
- Testimonials
- CTA sections

### About Page (/about)
- Hero text
- Monica's story (multiple paragraphs)
- Credentials list
- Philosophy section
- CTA button

### Contact Page (/contact)
- All headings and descriptions
- Form labels and placeholders
- FAQ items
- Google Calendar instructions

## 🎯 Monica's Training Materials

### Video Script (Keep it under 10 minutes!)
```
"Hi Monica! Let me show you how easy it is to edit your website.

1. First, login at ibuildcalm.com/portal
2. Click 'Edit My Website' 
3. Now you're in edit mode - see the banner at the top?
4. Hover over any text - see the outline?
5. Hold Shift and click - the editor opens
6. Make your changes - just like Microsoft Word
7. Click Save - that's it!
8. Your changes save automatically every 30 seconds
9. To add a blog post, click 'New Article' in your dashboard
10. Fill in the form, click Publish - done!"
```

### PDF Quick Guide Content
Create a simple 1-page PDF with:
- Login URL and credentials
- Screenshot of edit mode
- "Shift+Click to edit" reminder
- Support email/phone

## ⚠️ Critical Reminders

### Monica is NOT technical!
- No markdown
- No HTML
- No code blocks
- No technical terms
- Keep everything SIMPLE

### She'll primarily edit:
1. Blog posts (her main focus)
2. Service descriptions
3. Testimonials
4. Contact info

### Support Strategy
- First week: Daily check-in
- First month: Weekly check-in
- After that: Monthly check-in
- Always available via email

## 🔧 Portal API Endpoints Your System Needs

```javascript
// Get content
GET /api/content/{siteId}/{fieldId}

// Update content  
POST /api/content/{siteId}/{fieldId}
Body: { value: "new content" }

// Get all content for a site
GET /api/content/{siteId}

// Upload image
POST /api/media/{siteId}
Body: FormData with image

// Create blog post
POST /api/content/{siteId}/blog
Body: { title, content, category, excerpt }
```

## 🎉 Success Metrics

Monica successfully:
- [ ] Logs into portal
- [ ] Enters edit mode
- [ ] Edits a piece of text
- [ ] Sees her change on the site
- [ ] Creates a blog post
- [ ] Uploads an image
- [ ] Publishes changes

Once she does all these, the CMS is working!

## 📞 Monica's Support Path

1. Check FAQ in portal
2. Watch training video again
3. Email Tom
4. Schedule Zoom call if needed

Remember: BE PATIENT. She's learning something completely new.

---

*Created: September 4, 2025*
*Purpose: Get Monica set up with CMS access ASAP*