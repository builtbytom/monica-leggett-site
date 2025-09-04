// Simple test of the CMS config logic
const repo = 'https://github.com/builtbytom/monica-leggett-site';

function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2].replace('.git', '') };
}

async function testCMSConfig() {
  try {
    const { owner, repo: repoName } = parseGitHubUrl(repo);
    const url = `https://api.github.com/repos/${owner}/${repoName}/contents/cms.config.json`;
    
    console.log('Parsed owner:', owner);
    console.log('Parsed repo:', repoName);
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      console.error('Response not ok:', await response.text());
      return;
    }

    const data = await response.json();
    console.log('Data type:', data.type);
    console.log('Data encoding:', data.encoding);
    
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const config = JSON.parse(content);
    
    console.log('Config sections:', config.sections?.length);
    console.log('Success!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCMSConfig();