import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

// Schema for Monica's homepage content
const homepageSettings = {
  name: 'homepageSettings',
  title: 'Homepage Content',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main hero headline'
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string'
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      rows: 3
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
      type: 'text',
      rows: 4
    },
    {
      name: 'aboutBio2',
      title: 'Bio Paragraph 2',
      type: 'text',
      rows: 4
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
    
    // Images
    {
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Background image for the hero section',
      options: {
        hotspot: true
      }
    },
    {
      name: 'aboutImage',
      title: 'Monica\'s Photo',
      type: 'image',
      description: 'Professional photo of Monica',
      options: {
        hotspot: true
      }
    },
    {
      name: 'bookImage',
      title: 'Book Cover Image',
      type: 'image',
      description: 'Cover image of "Doubtful to Decisive"',
      options: {
        hotspot: true
      }
    },
    {
      name: 'testimonial1Quote',
      title: 'Testimonial 1 - Quote',
      type: 'text',
      rows: 3
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
      type: 'text',
      rows: 3
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
      type: 'text',
      rows: 3
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
  name: 'monica-leggett-studio',
  title: 'Monica Leggett Website Editor',
  projectId: 'li2bkslz',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Website Content')
          .items([
            S.listItem()
              .title('Homepage Content')
              .icon(() => '🏠')
              .child(
                S.document()
                  .schemaType('homepageSettings')
                  .documentId('homepage-settings')
                  .title('Edit Homepage')
              )
          ])
    }),
    visionTool()
  ],
  schema: {
    types: [homepageSettings]
  }
})