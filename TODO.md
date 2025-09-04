# Monica Leggett Site - Master TODO List
*Last Updated: September 4, 2025 - 7:30 AM*

## 🚨 CRITICAL INFO FOR CONTEXT RESET
- **Client:** Monica Leggett - older, non-technical, considers herself a writer
- **Budget:** $3,500 flat rate (Tom's standard)
- **Stack:** Astro + Tailwind v3 (NOT v4!) + Tom's Custom Portal CMS
- **Dev Server:** Running on port 4322
- **Colors:** Using her actual brand colors from book (#1A3C5D, #209697, #98B966)
- **CMS:** EVERYTHING must be editable - already set up with data-cms attributes

---

## ✅ COMPLETED

### 1. Project Setup
- [x] Initialize Astro project
- [x] Install Tailwind v3 (specifically v3, not v4 - Tom said v4 is broken)
- [x] Configure content collections
- [x] Set up project structure
- [x] Create notes file (monica-leggett-project-notes.md)

### 2. Homepage
- [x] Create base layout with navigation and footer
- [x] Build rotating hero carousel for all 4 services
  - [x] Auto-rotate every 5 seconds
  - [x] Manual navigation dots
  - [x] Service labels
  - [x] Mobile swipe support
  - [x] Keyboard navigation
- [x] Create "Meet Monica" section
- [x] Build 4 service pillar cards
  - [x] Fix button alignment (flex-grow and mt-auto)
- [x] Add lead magnet CTA section
- [x] Add testimonials section

### 3. Brand & Colors
- [x] Extract actual colors from current site
- [x] Update Tailwind config with real brand colors:
  - monica-navy: #1A3C5D
  - monica-teal: #209697
  - monica-sage: #98B966
  - monica-blue: #116DFF
- [x] Apply colors consistently across all components

### 4. CMS Integration
- [x] Add data-cms attributes to ALL text elements
- [x] Add data-cms-image attributes to images
- [x] Create cms-config.js with field mappings
- [x] Create CMSContent wrapper component
- [x] Document CMS integration (CMS-INTEGRATION.md)
- [x] Set up Monica-friendly settings (auto-save, big text, preview)

### 5. Hero & Design Updates (Sept 4)
- [x] Fix hero carousel image sizing (no more jarring jumps)
- [x] Standardize all buttons to gradient style
- [x] Update footer to "Craft My Marketing" with cmmct.com link
- [x] Add scroll animations (parallax-like effects Monica loved)

### 6. Learning Center COMPLETE (Sept 4)
- [x] Migrate all 12 articles from current site
- [x] Expand content from snippets to 4-7 min reads
- [x] Create search functionality
- [x] Add category filtering
- [x] Build individual article pages with dynamic routing
- [x] Add step navigation for 8-step framework
- [x] Implement related articles section
- [x] Add strong CTAs to drive conversions
- [x] Make 100% CMS-editable with unique identifiers

---

## 📝 IN PROGRESS

Nothing currently in progress - Learning Center complete, ready for next task

---

## ⏳ TODO (Priority Order)

### 1. ~~Learning Center~~ ✅ DONE (was Blog - Monica calls it Learning Center)
- [x] Created as Learning Center, not blog
- [x] All functionality complete
- [x] 12 articles migrated and expanded
- [x] Search, filters, individual pages all working

### 2. About Page (NEW PRIORITY)
- [ ] Create blog listing page (/blog)
- [ ] Set up blog post template
- [ ] Implement search functionality
- [ ] Add category filtering
- [ ] Create tag system
- [ ] Add "related posts" feature
- [ ] Create blog post CMS fields
- [ ] Add rich text editor for Monica
- [ ] Implement draft/publish workflow
- [ ] Add view counter
- [ ] Create RSS feed
- [ ] Add social sharing buttons

### 2. Action/Events Page (Currently broken on her site)
- [ ] Create /events page
- [ ] Build event listing component
- [ ] Add event registration forms
- [ ] Create event CMS fields
- [ ] Add calendar view option
- [ ] Implement "past events" archive

### 3. Lead Magnet System (Action Guide)
- [ ] Create email capture form
- [ ] Set up auto-responder
- [ ] Build download page
- [ ] Implement email validation
- [ ] Add to newsletter list integration
- [ ] Create thank you page

### 4. Individual Service Pages
- [ ] /services/book page
- [ ] /services/personal-coaching page
- [ ] /services/mentor-coaching page
- [ ] /services/masterminds page
- [ ] Add CMS fields for each service

### 5. Other Core Pages
- [ ] About page (expanded version)
- [ ] Contact page with form
- [ ] Book Club Resources page
- [x] Learning Center page ✅ COMPLETE
- [ ] Privacy Policy page
- [ ] Terms of Service page

### 6. Content Migration
- [ ] Extract all text from current Wix site
- [ ] Download all images from current site
- [ ] Migrate existing blog posts
- [ ] Format content for CMS
- [ ] Create redirects for old URLs

### 7. Forms & Integrations
- [ ] Contact form
- [ ] Consultation booking form
- [ ] Newsletter signup
- [ ] Book club registration
- [ ] Mastermind application
- [ ] Email service integration (which service does she use?)

### 8. SEO & Performance
- [ ] Add meta tags to all pages
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Implement Open Graph tags
- [ ] Add Google Analytics
- [ ] Optimize images
- [ ] Add lazy loading
- [ ] Test Core Web Vitals

### 9. Mobile Optimization
- [ ] Test all pages on mobile
- [ ] Fix any responsive issues
- [ ] Ensure touch targets are large enough
- [ ] Test forms on mobile
- [ ] Verify CMS works on iPad

### 10. Deployment
- [ ] Set up Netlify deployment
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] SSL certificate
- [ ] Configure email forwarding
- [ ] Set up backups

### 11. Training & Handoff
- [ ] Create Monica's portal account
- [ ] Record CMS training video
- [ ] Create PDF cheat sheet
- [ ] Schedule training call
- [ ] Test Monica can log in
- [ ] Verify she can edit content
- [ ] Set up support process

---

## 🎯 TODAY'S FOCUS

**COMPLETED: Learning Center (was Blog)**
✅ Beautiful, clean design
✅ Easy to navigate
✅ Search that actually works
✅ Categories and filters
✅ Super simple CMS editing
✅ Can't break anything

**NEXT TASK: About Page**
- Pull content from current site
- Make everything CMS-editable
- Include Monica's story, credentials, approach

---

## 📌 IMPORTANT REMINDERS

1. **Tailwind v3 ONLY** - Tom said v4 is broken
2. **Everything must be CMS-editable** - Do it as we build, not after
3. **Monica is older and non-technical** - Keep it SIMPLE
4. **She likes her current colors** - Even though they're dated
5. **Blog is her priority** - Must be perfect
6. **No monthly fees** - Using Tom's portal, not third-party CMS
7. **Mobile-first** - She might edit from iPad
8. **Friday-to-Monday delivery** - Tom's timeline

---

## 🔴 KNOWN ISSUES

- Current Wix site is slow and cluttered
- Navigation has 17 items (needs to be 7)
- Action/Events page is broken
- Colors are dated (but she likes them)
- She has tons of blog content to migrate

---

## 📞 QUESTIONS FOR TOM/MONICA

1. Which email service does Monica use? (Mailchimp, ConvertKit, etc.)
2. Does she need e-commerce for book sales or just Amazon links?
3. How many blog posts need to be migrated?
4. Does she need blog comments?
5. Calendar integration for consultation bookings?
6. Any specific SEO keywords to target?
7. Google Analytics account details?

---

## 🚀 QUICK COMMANDS

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Check current port
# Running on: http://localhost:4322

# Project location
cd /Users/tld/claude-workspace/projects/monica-leggett-site
```

---

## 📁 KEY FILES

- `/monica-leggett-project-notes.md` - Overall project planning
- `/TODO.md` - This file (master checklist)
- `/CMS-INTEGRATION.md` - CMS setup documentation
- `/src/lib/cms-config.js` - CMS configuration
- `/tailwind.config.js` - Color definitions (KEEP v3!)

---

*If context resets, start by reading this file and the project notes!*