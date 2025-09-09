import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

// Schema definitions
const homepageSettings = {
  name: 'homepageSettings',
  title: 'Homepage Content',
  type: 'document',
  fields: [
    // Hero Section
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main hero headline'
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'Hero subtitle text'
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      description: 'Hero description paragraph'
    },
    {
      name: 'heroPrimaryCTA',
      title: 'Primary Button Text',
      type: 'string'
    },
    {
      name: 'heroPrimaryLink',
      title: 'Primary Button Link',
      type: 'string'
    },
    {
      name: 'heroSecondaryCTA',
      title: 'Secondary Button Text',
      type: 'string'
    },
    {
      name: 'heroSecondaryLink',
      title: 'Secondary Button Link',
      type: 'string'
    },
    
    // About Section
    {
      name: 'aboutHeading1',
      title: 'About Heading Part 1',
      type: 'string'
    },
    {
      name: 'aboutHeading2',
      title: 'About Heading Part 2',
      type: 'string'
    },
    {
      name: 'aboutSubtitle',
      title: 'About Subtitle',
      type: 'string'
    },
    {
      name: 'aboutBio1',
      title: 'Bio Paragraph 1',
      type: 'text'
    },
    {
      name: 'aboutBio2',
      title: 'Bio Paragraph 2',
      type: 'text'
    },
    {
      name: 'aboutCTAText',
      title: 'About Button Text',
      type: 'string'
    },
    {
      name: 'aboutCTALink',
      title: 'About Button Link',
      type: 'string'
    },
    
    // Testimonials
    {
      name: 'testimonial1Quote',
      title: 'Testimonial 1 - Quote',
      type: 'text'
    },
    {
      name: 'testimonial1Author',
      title: 'Testimonial 1 - Author',
      type: 'string'
    },
    {
      name: 'testimonial1Title',
      title: 'Testimonial 1 - Title',
      type: 'string'
    },
    {
      name: 'testimonial2Quote',
      title: 'Testimonial 2 - Quote',
      type: 'text'
    },
    {
      name: 'testimonial2Author',
      title: 'Testimonial 2 - Author',
      type: 'string'
    },
    {
      name: 'testimonial2Title',
      title: 'Testimonial 2 - Title',
      type: 'string'
    },
    {
      name: 'testimonial3Quote',
      title: 'Testimonial 3 - Quote',
      type: 'text'
    },
    {
      name: 'testimonial3Author',
      title: 'Testimonial 3 - Author',
      type: 'string'
    },
    {
      name: 'testimonial3Title',
      title: 'Testimonial 3 - Title',
      type: 'string'
    }
  ]
}

export default defineConfig({
  name: 'monica-leggett-site',
  title: 'Monica Leggett Website',
  projectId: 'li2bkslz',
  dataset: 'production',
  plugins: [
    structureTool(),
    visionTool()
  ],
  schema: {
    types: [homepageSettings]
  }
})