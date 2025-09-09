import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

// Schema for Service Pages (Book, Coaching, Masterminds, etc.)
const servicePageSettings = {
  name: 'servicePageSettings',
  title: 'Service Pages',
  type: 'document',
  fields: [
    {
      name: 'serviceType',
      title: 'Service Type',
      type: 'string',
      options: {
        list: [
          {title: 'Book - Doubtful to Decisive', value: 'book'},
          {title: 'Personal Coaching', value: 'personal-coaching'},
          {title: 'Mentor Coaching', value: 'mentor-coaching'},
          {title: 'Masterminds', value: 'masterminds'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'heroTitle',
      title: 'Page Title',
      type: 'string',
      description: 'Main headline for the service page'
    },
    {
      name: 'heroSubtitle',
      title: 'Page Subtitle',
      type: 'string',
      description: 'Supporting text under the title'
    },
    {
      name: 'heroDescription',
      title: 'Introduction Text',
      type: 'text',
      rows: 4,
      description: 'Opening paragraph that describes the service'
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'Main image for this service',
      options: {
        hotspot: true
      }
    },
    {
      name: 'mainContent',
      title: 'Main Content',
      type: 'array',
      of: [
        {
          type: 'block',
          title: 'Content Block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'}
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'}
            ]
          }
        }
      ],
      description: 'Rich text content for the service details'
    },
    {
      name: 'ctaText',
      title: 'Call to Action Text',
      type: 'string',
      description: 'Button text for the main CTA'
    },
    {
      name: 'ctaLink',
      title: 'Call to Action Link',
      type: 'string',
      description: 'Where the CTA button should link to'
    }
  ]
}

// Schema for Monica's About page content
const aboutPageSettings = {
  name: 'aboutPageSettings',
  title: 'About Page Content',
  type: 'document',
  fields: [
    // Hero Section
    {
      name: 'heroTitle',
      title: 'Main Headline',
      type: 'string',
      description: 'Main page title (e.g., "Meet Monica Leggett")'
    },
    {
      name: 'heroSubtitle',
      title: 'Professional Title',
      type: 'string',
      description: 'Professional credentials line'
    },
    {
      name: 'heroMotto',
      title: 'Personal Motto',
      type: 'string',
      description: 'Inspirational quote or motto'
    },
    {
      name: 'heroImage',
      title: 'Profile Photo',
      type: 'image',
      description: 'Main profile photo',
      options: {
        hotspot: true
      }
    },
    {
      name: 'heroStatTitle',
      title: 'Experience Stat (Number)',
      type: 'string',
      description: 'Years of experience (e.g., "15+ Years")'
    },
    {
      name: 'heroStatDescription',
      title: 'Experience Stat (Description)',
      type: 'string',
      description: 'What the experience relates to'
    },
    {
      name: 'heroDescription',
      title: 'About Description',
      type: 'text',
      rows: 8,
      description: 'Main about description paragraphs'
    },
    
    // Quick Stats
    {
      name: 'stat1Number',
      title: 'Stat 1 - Number',
      type: 'string'
    },
    {
      name: 'stat1Label',
      title: 'Stat 1 - Label',
      type: 'string'
    },
    {
      name: 'stat2Number',
      title: 'Stat 2 - Number',
      type: 'string'
    },
    {
      name: 'stat2Label',
      title: 'Stat 2 - Label',
      type: 'string'
    },
    {
      name: 'stat3Number',
      title: 'Stat 3 - Number',
      type: 'string'
    },
    {
      name: 'stat3Label',
      title: 'Stat 3 - Label',
      type: 'string'
    },
    {
      name: 'stat4Number',
      title: 'Stat 4 - Number',
      type: 'string'
    },
    {
      name: 'stat4Label',
      title: 'Stat 4 - Label',
      type: 'string'
    }
  ]
}

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
              ),
            S.listItem()
              .title('About Page Content')
              .icon(() => '👤')
              .child(
                S.document()
                  .schemaType('aboutPageSettings')
                  .documentId('about-page-settings')
                  .title('Edit About Page')
              ),
            S.listItem()
              .title('Service Pages')
              .icon(() => '🎯')
              .child(
                S.list()
                  .title('Service Pages')
                  .items([
                    S.listItem()
                      .title('Book - Doubtful to Decisive')
                      .child(
                        S.document()
                          .schemaType('servicePageSettings')
                          .documentId('service-book')
                          .title('Edit Book Page')
                      ),
                    S.listItem()
                      .title('Personal Coaching')
                      .child(
                        S.document()
                          .schemaType('servicePageSettings')
                          .documentId('service-personal-coaching')
                          .title('Edit Personal Coaching Page')
                      ),
                    S.listItem()
                      .title('Mentor Coaching')
                      .child(
                        S.document()
                          .schemaType('servicePageSettings')
                          .documentId('service-mentor-coaching')
                          .title('Edit Mentor Coaching Page')
                      ),
                    S.listItem()
                      .title('Masterminds')
                      .child(
                        S.document()
                          .schemaType('servicePageSettings')
                          .documentId('service-masterminds')
                          .title('Edit Masterminds Page')
                      )
                  ])
              )
          ])
    }),
    visionTool()
  ],
  schema: {
    types: [homepageSettings, aboutPageSettings, servicePageSettings]
  }
})