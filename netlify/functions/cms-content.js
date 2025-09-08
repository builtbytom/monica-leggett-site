exports.handler = async (event) => {
  // Enable CORS for your portal
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Return the current content directly (matches content.json)
      const content = {
        "about_monica": {
          "heading_line1": "Meet",
          "heading_line2": "Monica Leggett [PORTAL TEST]",
          "subtitle": "⭐ Certified Coach, Author, and Speaker",
          "bio_paragraph1": "I'm Monica Leggett, a seasoned expert with years of experience dedicated to transforming lives and accelerating goal achievement. With proven methods, endless energy, and infectious enthusiasm, my passion lies in helping individuals navigate both career and personal journeys, whether you're climbing the corporate ladder or seeking to enhance your personal and professional journey.",
          "bio_paragraph2": "My approach isn't just about reaching goals; it's about the journey, the growth, and the insights you gain along the way. Together, we'll unlock your potential and create a life filled with purpose and fulfillment.",
          "cta_button_text": "✨ Learn More About Monica"
        },
        "services_section": {
          "book_title": "Doubtful to Decisive", 
          "book_description": "Start your transformation journey with my book. Eight proven steps to overcome doubt and take decisive action in your life."
        }
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          content: content,
        }),
      };
    } 
    
    else if (event.httpMethod === 'POST') {
      // For now, just return success for POST requests
      // In production, this would update GitHub via API
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Content updated successfully (simulated for testing)' 
        }),
      };
    }
    
    else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }
  } catch (error) {
    console.error('CMS content error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Failed to process request',
        stack: error.stack
      }),
    };
  }
};