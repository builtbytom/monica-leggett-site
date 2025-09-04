# Monica Leggett Website Rebuild - Project Notes

## 🎯 Project Overview
**Client:** Monica Leggett - Life Coach, Author, Speaker  
**Current Site:** https://www.monicaleggett.com (on Wix)  
**Project Status:** Planning Phase  
**Budget:** $3,500 flat rate (Tom's standard)  

---

## 📋 What We Know

### Client Profile
- **Older, non-technical** - needs dead simple CMS
- **Considers herself a writer** - blog is her priority
- **Likes current color scheme** - pulled from book cover (#1A3C5D, #209697, #98B966)
- **Has existing content** - needs migration from Wix

### Her 4 Service Pillars
1. **Book** - "Doubtful to Decisive" (primary product)
2. **Mentor Coaching** - Training other coaches
3. **Personal Coaching** - 1-on-1 client transformation
4. **Masterminds** - Group coaching programs

### Must-Have Pages
- **Home** - Clear value prop, 4 services visible
- **About** - Her story, credentials
- **Services** - Detailed breakdown of 4 pillars
- **Book** - Sales page for "Doubtful to Decisive"
- **Action/Events** - Event landing page (currently broken)
- **Blog** - Searchable, filterable, her main content hub
- **Contact** - Simple contact form

### Special Requirements
- **Action Guide** - Lead magnet PDF behind email gate
- **Event Registration** - For workshops/masterminds
- **Blog Features** - Search, filter by category, tags
- **Newsletter Signup** - Integration with email service

---

## 🛠 Technical Stack Decision

### Why Astro Makes Sense Here
✅ **Perfect for content sites** - Monica's is mostly static content  
✅ **Blazing fast** - Better than her Wix site  
✅ **Great SEO out of the box** - She needs to be found  
✅ **Works with your CMS** - Can integrate with Tom's portal  
✅ **Easy blog setup** - Built-in content collections  
✅ **No client-side JS bloat** - Fast on mobile  

### Build Approach
```
Framework: Astro 4.x
Styling: Tailwind CSS
CMS: Tom's Custom Portal (already built)
Hosting: Netlify
Blog: Astro Content Collections
Forms: Netlify Forms
Analytics: Google Analytics 4
```

### Alternative Considered
- **Next.js** - Overkill for mostly static site
- **WordPress** - Monthly hosting fees, against Tom's model
- **Webflow** - Monthly fees, less control

---

## 🏗 Build Phases

### Phase 1: Setup & Structure (Day 1 Morning) ✅ COMPLETE
- [x] Initialize Astro project
- [x] Set up Tailwind CSS (v3 specifically)
- [x] Create page structure
- [x] Set up content collections for blog
- [ ] Configure Netlify deployment

### Phase 2: Content Migration (Day 1 Afternoon)
- [ ] Extract all text from current site
- [ ] Download all images
- [ ] Set up blog post migration
- [ ] Create content markdown files

### Phase 3: Design Implementation (Day 2)
- [ ] Homepage with 4 service pillars
- [ ] About page
- [ ] Services pages (4 separate)
- [ ] Blog listing with search/filter
- [ ] Individual blog post template

### Phase 4: Features (Day 3 Morning)
- [ ] Action Guide email gate
- [ ] Event registration system
- [ ] Newsletter signup
- [ ] Contact forms
- [ ] Blog search/filter/tags

### Phase 5: CMS Integration (Day 3 Afternoon)
- [ ] Connect to Tom's portal
- [ ] Set up editable regions
- [ ] Test Monica's login
- [ ] Configure blog post creation

### Phase 6: Polish & Launch (Day 4)
- [ ] Mobile optimization
- [ ] SEO meta tags
- [ ] Performance audit
- [ ] Client training video
- [ ] DNS switchover

---

## 📝 CMS Fields for Monica

### What She Can Edit
1. **Homepage**
   - Hero headline & subtext
   - Service descriptions
   - CTA button text

2. **About Page**
   - Bio text
   - Credentials list
   - Profile photo

3. **Blog**
   - Create/edit posts
   - Manage categories
   - Add tags
   - Upload images
   - Schedule publishing

4. **Events**
   - Add workshops
   - Edit descriptions
   - Registration links

### What Tom Controls
- Navigation structure
- Page layouts
- Technical SEO
- Form integrations
- Payment processing

---

## 🎨 Design Notes

### Keep From Current Site
- Color scheme (blues/greens - she likes it)
- Professional headshot prominent
- Book cover visible on homepage
- Testimonials

### Modernize
- Cleaner navigation (17 links → 7)
- More whitespace
- Better mobile experience
- Faster load times
- Clear CTAs (not 12 on one page)

### Color Palette (Her Current)
```css
--primary-blue: #4A90E2;
--secondary-green: #7ED321;
--text-dark: #333333;
--text-light: #666666;
--background: #FFFFFF;
--accent-gold: #F5A623;
```

---

## 🚀 Deployment Plan

### Netlify Setup
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables for CMS
5. Form notifications to Monica's email

### DNS Migration
- Keep Wix active until ready
- Switch nameservers on launch day
- SSL auto-configured by Netlify

---

## 📚 Training Materials for Monica

### Need to Create
1. **Login Guide** - How to access CMS portal
2. **Blog Tutorial** - Writing and publishing posts
3. **Image Guide** - Uploading and replacing images
4. **Event Manager** - Adding workshops/events
5. **Emergency Contact** - Tom's phone for help

### Delivery Method
- 15-minute Loom walkthrough
- PDF cheat sheet
- Monthly check-in call

---

## ⚠️ Known Challenges

1. **Migration from Wix** - Manual content extraction
2. **Her Age/Tech Level** - Extra simple CMS needed
3. **Dated Design Preferences** - Balance her wishes with modern UX
4. **Blog Import** - May have many posts to migrate

---

## 📊 Success Metrics

- Site loads in < 2 seconds
- Mobile score > 95 on PageSpeed
- Monica can publish blog post alone
- No support calls in first month
- Increased consultation bookings

---

## 🔄 Next Steps

1. **Confirm with Tom** - Astro is the right choice
2. **Set up project** - Initialize Astro with Tailwind
3. **Create templates** - Page layouts and components
4. **Migrate content** - Start with homepage
5. **Build blog system** - Her top priority

---

## 💡 Remember

- **She's non-technical** - Every CMS field needs clear labels
- **Blog is her baby** - This needs to work perfectly
- **No monthly fees** - Use Tom's portal, not third-party
- **Keep it simple** - She should never need to call for basic edits
- **Friday to Monday** - Tom's timeline for delivery

---

## 🤝 Handoff Checklist

When complete, Monica gets:
- [ ] Portal login credentials
- [ ] Training video link
- [ ] PDF quick reference
- [ ] Tom's phone number
- [ ] First blog post created together
- [ ] Calendar invite for check-in

---

## 🚀 Current Progress (Sept 3, 2025)

### ✅ COMPLETED:
1. **Project Setup**
   - Astro with Tailwind v3 (not v4 to avoid issues)
   - Content collections configured
   - Dev server running on port 4322

2. **Homepage**
   - Rotating hero carousel for all 4 services
   - Mobile swipe support
   - Service cards with aligned CTAs
   - Lead magnet section
   - Testimonials

3. **Brand Colors Updated**
   - Extracted actual colors from current site
   - Updated Tailwind config with real brand colors
   - Applied consistently across all components

4. **CMS Preparation**
   - All text elements have `data-cms` attributes
   - Images marked with `data-cms-image` 
   - Ready for portal integration

### 🔄 IN PROGRESS:
- Verifying CMS integration setup
- Planning blog system architecture

### 📝 NEXT PRIORITIES:
1. **Blog System** (Monica's #1 priority)
   - Search functionality
   - Filter by category
   - Tag system
   - CMS-editable posts

2. **Action/Events Page**
   - Event landing page redesign
   - Lead magnet delivery

3. **Content Migration**
   - Extract from current Wix site
   - Format for Astro/CMS

### 💡 KEY DECISIONS MADE:
- Using Astro (perfect for content sites)
- Tailwind v3 (not v4 - stability)
- Tom's custom portal CMS (no monthly fees)
- Keeping Monica's color scheme (from book cover)
- Hero carousel to showcase all services equally

### ⚠️ IMPORTANT NOTES:
- **CMS Integration**: Need to ensure ALL content is editable NOW before building more
- **Monica's Age**: Keep CMS interface extremely simple
- **Blog Priority**: This is her baby - must be perfect

*Last Updated: September 3, 2025 - 2:00 PM*