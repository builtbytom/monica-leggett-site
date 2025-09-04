exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const url = 'https://api.github.com/repos/builtbytom/monica-leggett-site/contents/cms.config.json';
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const responseText = await response.text();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        responseLength: responseText.length,
        responsePreview: responseText.substring(0, 200),
        url
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
    };
  }
};