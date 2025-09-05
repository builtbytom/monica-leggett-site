// netlify/functions/upload-image.js

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { image, filename, repo, token } = JSON.parse(event.body);

    if (!image || !filename || !repo || !token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Extract owner and repo name from repo string
    const [owner, repoName] = repo.split('/');
    
    // Ensure filename goes to public/images directory
    const imagePath = `public/images/${filename}`;
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
    
    // Check if file exists first
    let sha;
    try {
      const existingFileResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/contents/${imagePath}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (existingFileResponse.ok) {
        const existingFile = await existingFileResponse.json();
        sha = existingFile.sha;
      }
    } catch (e) {
      // File doesn't exist, that's okay
    }

    // Upload or update the image
    const uploadResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repoName}/contents/${imagePath}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload image: ${filename}`,
          content: imageBuffer.toString('base64'),
          ...(sha && { sha }), // Include sha if updating existing file
        }),
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error('GitHub API error:', error);
      return {
        statusCode: uploadResponse.status,
        headers,
        body: JSON.stringify({ error: `Failed to upload image: ${error}` }),
      };
    }

    const result = await uploadResponse.json();
    
    // Return the public URL for the uploaded image
    const imageUrl = `/images/${filename}`;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        url: imageUrl,
        githubUrl: result.content.html_url 
      }),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};