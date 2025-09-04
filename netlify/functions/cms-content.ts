import { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// Monica Leggett Site Content Structure
const DEFAULT_CONTENT = {
  homepage: {
    hero: {
      book: {
        title: "Doubtful to Decisive:",
        subtitle: "Transform Your Life in 8 Steps",
        description: "Discover the proven framework that has helped hundreds of professionals break through self-doubt and take decisive action in their careers and lives.",
        cta1: "Get Your Copy",
        cta2: "Read First Chapter Free"
      },
      coaching: {
        title: "Transform Your Life",
        subtitle: "Personal Coaching for Professionals",
        description: "Break through barriers, overcome self-doubt, and achieve the success you deserve with personalized one-on-one coaching.",
        cta1: "Book Discovery Call",
        cta2: "Learn More"
      },
      mentor: {
        title: "Become a Certified Coach",
        subtitle: "ICF Mentor Coaching Program",
        description: "Ready to turn your passion for helping others into a thriving coaching practice? Get the training, certification, and support you need.",
        cta1: "Apply Now",
        cta2: "View Requirements"
      },
      mastermind: {
        title: "Join a Mastermind Group",
        subtitle: "Accelerate Your Growth",
        description: "Connect with like-minded professionals in our exclusive mastermind groups. Share challenges, celebrate wins, and grow together.",
        cta1: "Join Next Cohort",
        cta2: "Learn More"
      }
    },
    about: {
      title: "Meet Monica",
      subtitle: "Your Guide to Decisive Action",
      description1: "I'm Monica Leggett, a certified life coach, author, and speaker with over 20 years of experience helping professionals transform their lives. My journey from corporate burnout to purposeful living inspired me to help others break free from self-doubt.",
      description2: "Through my proven 8-step framework, I've guided hundreds of clients from feeling stuck and overwhelmed to living with clarity, confidence, and purpose. Whether you're seeking personal transformation, building a coaching practice, or looking for community support, I'm here to help you take decisive action.",
      cta: "Learn More About Me"
    },
    services: {
      sectionTitle: "How Can I Help You?",
      sectionSubtitle: "Choose Your Path to Transformation",
      book: {
        title: "📚 Get the Book",
        description: "Start your transformation journey with 'Doubtful to Decisive' - your roadmap to breaking through barriers and achieving your goals.",
        cta: "Order Now"
      },
      coaching: {
        title: "🌟 Personal Coaching",
        description: "Get personalized one-on-one support to overcome challenges, set clear goals, and create lasting change in your life.",
        cta: "Book Discovery Call"
      },
      mentor: {
        title: "🎓 Mentor Coaching",
        description: "Build your coaching practice with ICF-accredited training, certification support, and ongoing mentorship.",
        cta: "Start Your Journey"
      },
      mastermind: {
        title: "🤝 Join a Mastermind",
        description: "Connect with ambitious professionals in small group settings for accountability, support, and accelerated growth.",
        cta: "Apply to Join"
      }
    },
    leadMagnet: {
      title: "Ready to Take Action? 🚀",
      description: "Download my free Action Guide and start your transformation today!",
      buttonText: "Get Your Free Guide",
      emailPlaceholder: "Enter your email"
    },
    testimonials: {
      sectionTitle: "Success Stories",
      items: [
        {
          name: "Sarah M.",
          title: "Marketing Director",
          quote: "Monica's 8-step framework completely transformed how I approach challenges. I went from feeling stuck to landing my dream job!",
          rating: 5
        },
        {
          name: "John D.",
          title: "Business Owner",
          quote: "The mastermind group gave me the accountability and support I needed to finally launch my business. Monica is an incredible facilitator.",
          rating: 5
        },
        {
          name: "Lisa R.",
          title: "ICF Certified Coach",
          quote: "Monica's mentor coaching program fast-tracked my certification. Her guidance was invaluable in building my practice.",
          rating: 5
        }
      ]
    }
  },
  
  // About Page
  about: {
    heroTitle: "Hi, I'm Monica Leggett",
    heroSubtitle: "From Doubt to Decisive Action",
    story: "My journey began in corporate America, where despite outward success, I felt stuck and unfulfilled. After years of self-doubt and indecision, I discovered the power of decisive action. Now, I help others make the same transformation.",
    credentials: [
      "ICF Certified Professional Coach (PCC)",
      "Master's in Organizational Psychology",
      "20+ years coaching experience",
      "Author of 'Doubtful to Decisive'",
      "TEDx Speaker"
    ],
    philosophy: "I believe everyone has the capacity for greatness. Sometimes we just need the right framework, support, and accountability to unlock it."
  },
  
  // Contact Page
  contact: {
    heroTitle: "Let's Connect",
    heroSubtitle: "Start Your Transformation Journey Today",
    formTitle: "Send Me a Message",
    scheduleTitle: "Schedule a Discovery Call",
    officeHours: "Monday - Friday: 9am - 5pm EST",
    responseTime: "I typically respond within 24 hours"
  },
  
  // Navigation & Footer
  navigation: {
    logoText: "Monica Leggett",
    ctaButton: "Book Discovery Call"
  },
  
  footer: {
    about: "Monica Leggett is a certified life coach, author, and speaker dedicated to helping professionals move from doubt to decisive action.",
    newsletterTitle: "Stay Connected",
    newsletterDescription: "Get weekly insights and inspiration delivered to your inbox.",
    newsletterButton: "Subscribe",
    copyright: "© 2025 Monica Leggett Coaching. All rights reserved."
  }
};

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Get content store
    const store = getStore('monica-content');
    
    if (event.httpMethod === 'GET') {
      const path = event.queryStringParameters?.path;
      
      // Get stored content or use default
      const storedContent = await store.get('content', { type: 'json' });
      const content = storedContent || DEFAULT_CONTENT;
      
      if (path) {
        // Return specific path
        const pathParts = path.split('.');
        let result = content;
        
        for (const part of pathParts) {
          result = result[part];
          if (!result) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Content not found' }),
            };
          }
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, content: result }),
        };
      }
      
      // Return all content
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, content }),
      };
    }
    
    if (event.httpMethod === 'POST' || event.httpMethod === 'PUT') {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Content required' }),
        };
      }
      
      const { path, value } = JSON.parse(event.body);
      
      if (!path || value === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Path and value required' }),
        };
      }
      
      // Get current content
      const storedContent = await store.get('content', { type: 'json' }) || DEFAULT_CONTENT;
      
      // Update specific path
      const pathParts = path.split('.');
      let current = storedContent;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = value;
      
      // Save updated content
      await store.setJSON('content', storedContent);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Content updated' }),
      };
    }
    
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    
  } catch (error) {
    console.error('CMS content error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to process request' 
      }),
    };
  }
};