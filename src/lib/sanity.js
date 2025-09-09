import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false, // Disable CDN for real-time updates during builds
  apiVersion: '2024-01-01',
});

// Helper function to fetch all posts (Learning Center articles)
export async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "categories": categories[]->title,
    "author": author->name,
    body
  }`;
  
  return await client.fetch(query);
}

// Helper function to fetch a single post by slug
export async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "categories": categories[]->title,
    "author": author->name,
    body
  }`;
  
  return await client.fetch(query, { slug });
}

// Helper function to fetch About page content
export async function getAboutPageContent() {
  const query = `*[_type == "aboutPageSettings" && _id == "about-page-settings"][0] {
    _id,
    heroTitle,
    heroSubtitle,
    heroMotto,
    heroImage,
    heroStatTitle,
    heroStatDescription,
    heroDescription,
    stat1Number,
    stat1Label,
    stat2Number,
    stat2Label,
    stat3Number,
    stat3Label,
    stat4Number,
    stat4Label
  }`;
  
  const result = await client.fetch(query);
  
  // If no About page content exists, return default structure
  if (!result) {
    return {
      heroTitle: "Meet Monica Leggett",
      heroSubtitle: "Professional Certified Coach | Author | Speaker",
      heroMotto: '"Dream It. Plan It. Do It. Live It!"',
      heroImage: null,
      heroStatTitle: "15+ Years",
      heroStatDescription: "Transforming Lives Through Coaching",
      heroDescription: "For over 15 years, I've been helping individuals, couples, teams, and small business owners shift from struggling to thriving – one strategic step at a time. As a certified Professional Coach (PCC), mentor coach, and author, I'm passionate about helping you break free from doubt, overwhelm, and frustration to find clarity, confidence, and joy.\n\nKnown as the \"conversation whisperer,\" I specialize in helping my clients navigate crucial conversations that build or mend relationships. Whether you're an emerging leader, a small business owner, or someone seeking personal transformation, I provide the strategic guidance and support you need to achieve your goals.",
      stat1Number: "500+",
      stat1Label: "Clients Transformed",
      stat2Number: "2",
      stat2Label: "Published Books",
      stat3Number: "15+",
      stat3Label: "Years Experience",
      stat4Number: "100%",
      stat4Label: "Client Satisfaction"
    };
  }
  
  return result;
}

// Helper function to fetch service page content
export async function getServicePageContent(serviceType) {
  const query = `*[_type == "servicePageSettings" && serviceType == $serviceType][0] {
    _id,
    serviceType,
    heroTitle,
    heroSubtitle,
    heroDescription,
    heroImage,
    mainContent,
    ctaText,
    ctaLink
  }`;
  
  const result = await client.fetch(query, { serviceType });
  
  // If no service content exists, return default structure
  if (!result) {
    const defaults = {
      'book': {
        heroTitle: 'Doubtful to Decisive',
        heroSubtitle: 'Eight Steps to Get Unstuck and Take Action',
        heroDescription: 'Transform your life with my bestselling book that has helped thousands move from paralysis to purposeful action.',
        mainContent: [],
        ctaText: 'Get Your Copy Today',
        ctaLink: 'https://www.amazon.com/dp/your-book-link'
      },
      'personal-coaching': {
        heroTitle: 'Personal Coaching',
        heroSubtitle: 'Transform Your Life, One Step at a Time',
        heroDescription: 'Personalized one-on-one coaching to help you overcome obstacles and achieve your goals.',
        mainContent: [],
        ctaText: 'Schedule a Discovery Call',
        ctaLink: '/contact'
      },
      'mentor-coaching': {
        heroTitle: 'Mentor Coaching',
        heroSubtitle: 'Elevate Your Coaching Practice',
        heroDescription: 'For coaches seeking ICF certification or looking to enhance their skills.',
        mainContent: [],
        ctaText: 'Learn More',
        ctaLink: '/contact'
      },
      'masterminds': {
        heroTitle: 'Masterminds',
        heroSubtitle: 'The Power of Collective Wisdom',
        heroDescription: 'Join a supportive community of like-minded individuals committed to growth.',
        mainContent: [],
        ctaText: 'Apply Now',
        ctaLink: '/contact'
      }
    };
    
    return defaults[serviceType] || defaults['book'];
  }
  
  return result;
}

// Helper function to fetch contact page content
export async function getContactPageContent() {
  const query = `*[_type == "contactPageSettings" && _id == "contact-page-settings"][0] {
    _id,
    heroTitle,
    heroSubtitle,
    heroDescription,
    scheduleTitle,
    scheduleDescription,
    contactEmail,
    contactPhone,
    contactLocation,
    officeHours,
    linkedinUrl,
    facebookUrl,
    instagramUrl
  }`;
  
  const result = await client.fetch(query);
  
  // If no contact content exists, return default structure
  if (!result) {
    return {
      heroTitle: "Let's Start Your Transformation",
      heroSubtitle: "Your Journey to Clarity and Confidence Begins Here",
      heroDescription: "Whether you're ready to work together or just exploring your options, I'm here to help. Choose the best way to connect below.",
      scheduleTitle: "Schedule a Free Discovery Call",
      scheduleDescription: "30-minute no-pressure conversation about your goals",
      contactEmail: "monica@monicaleggett.com",
      contactPhone: "",
      contactLocation: "Connecticut, USA",
      officeHours: "Monday - Friday: 9:00 AM - 5:00 PM EST\nSaturday: By appointment\nSunday: Closed",
      linkedinUrl: "https://www.linkedin.com/in/monicaleggett",
      facebookUrl: "https://www.facebook.com/monicaleggettcoaching",
      instagramUrl: "https://www.instagram.com/monicaleggett"
    };
  }
  
  return result;
}

// Helper function to fetch categories
export async function getCategories() {
  const query = `*[_type == "category"] {
    _id,
    title,
    description
  }`;
  
  return await client.fetch(query);
}

// Helper function to fetch homepage content from proper Sanity fields
export async function getHomepageContent() {
  const query = `*[_type == "homepageSettings" && _id == "homepage-settings"][0] {
    _id,
    heroTitle,
    heroSubtitle, 
    heroDescription,
    heroPrimaryCTA,
    heroPrimaryLink,
    heroSecondaryCTA,
    heroSecondaryLink,
    aboutHeading1,
    aboutHeading2,
    aboutSubtitle,
    aboutBio1,
    aboutBio2,
    aboutCTAText,
    aboutCTALink,
    testimonial1Quote,
    testimonial1Author,
    testimonial1Title,
    testimonial2Quote,
    testimonial2Author,
    testimonial2Title,
    testimonial3Quote,
    testimonial3Author,
    testimonial3Title
  }`;
  
  const result = await client.fetch(query);
  
  // If no homepage content exists, return default structure
  if (!result) {
    return {
      hero: {
        title: "Doubtful to Decisive:",
        subtitle: "Eight Steps to Get Unstuck and Take Action",
        description: "Transform your life with my bestselling book. Learn the proven framework that's helped thousands move from paralysis to purposeful action.",
        primaryCTA: "📖 Get the Book",
        primaryLink: "/services/book",
        secondaryCTA: "🎁 Free Action Guide", 
        secondaryLink: "/learning-center"
      },
      about: {
        heading1: "Meet",
        heading2: "Monica Leggett",
        subtitle: "⭐ Certified Coach, Author, and Speaker",
        bio1: "I'm Monica Leggett, a seasoned expert with years of experience dedicated to transforming lives and accelerating goal achievement. With proven methods, endless energy, and infectious enthusiasm, my passion lies in helping individuals navigate both career and personal journeys.",
        bio2: "My approach isn't just about reaching goals; it's about the journey, the growth, and the insights you gain along the way. Together, we'll unlock your potential and create a life filled with purpose and fulfillment.",
        ctaText: "✨ Learn More About Monica",
        ctaLink: "/about"
      },
      testimonials: [
        {
          quote: "Monica's coaching transformed my approach to decision-making. I went from constantly second-guessing myself to confidently leading my team.",
          author: "Sarah M.",
          title: "Business Owner"
        },
        {
          quote: "The mastermind group changed everything for me. The support and accountability helped me launch my business in just 3 months.",
          author: "Michael R.",
          title: "Entrepreneur"  
        },
        {
          quote: "'Doubtful to Decisive' gave me the tools I needed to finally make the career change I'd been dreaming about for years.",
          author: "Jennifer K.",
          title: "Career Changer"
        }
      ]
    };
  }
  
  // Convert Sanity fields to structured format
  return {
    hero: {
      title: result.heroTitle || "Doubtful to Decisive:",
      subtitle: result.heroSubtitle || "Eight Steps to Get Unstuck and Take Action", 
      description: result.heroDescription || "Transform your life with my bestselling book...",
      primaryCTA: result.heroPrimaryCTA || "📖 Get the Book",
      primaryLink: result.heroPrimaryLink || "/services/book",
      secondaryCTA: result.heroSecondaryCTA || "🎁 Free Action Guide",
      secondaryLink: result.heroSecondaryLink || "/learning-center"
    },
    about: {
      heading1: result.aboutHeading1 || "Meet",
      heading2: result.aboutHeading2 || "Monica Leggett",
      subtitle: result.aboutSubtitle || "⭐ Certified Coach, Author, and Speaker",
      bio1: result.aboutBio1 || "I'm Monica Leggett...",
      bio2: result.aboutBio2 || "My approach isn't just about reaching goals...",
      ctaText: result.aboutCTAText || "✨ Learn More About Monica",
      ctaLink: result.aboutCTALink || "/about"
    },
    testimonials: [
      {
        quote: result.testimonial1Quote || "Monica's coaching transformed my approach...",
        author: result.testimonial1Author || "Sarah M.",
        title: result.testimonial1Title || "Business Owner"
      },
      {
        quote: result.testimonial2Quote || "The mastermind group changed everything...",
        author: result.testimonial2Author || "Michael R.",
        title: result.testimonial2Title || "Entrepreneur"
      },
      {
        quote: result.testimonial3Quote || "'Doubtful to Decisive' gave me the tools...",
        author: result.testimonial3Author || "Jennifer K.",
        title: result.testimonial3Title || "Career Changer"
      }
    ]
  };
}