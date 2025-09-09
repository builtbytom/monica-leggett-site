import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false,
  token: 'skKqet07GvU7mrd4XEjhRuZ0UuUhzeCrHAm0qRtV6doD6rhzJL3Zxs5bx4IeLewQ1yagc1urVDjEIJ7xvBNaJwx8WgSb7YUITZH80w2hpk262HKLFlRIqnQZ4oN5peCSYX7vtJtvpymvIz7f5Mm1oH0QzAeyghcGACOZGlEmZI1aLATA8w5c'
});

async function checkSanitySetup() {
  try {
    console.log('🔍 Checking Sanity project setup...');
    
    // Check if we can connect
    const projects = await client.request({
      uri: '/projects',
      method: 'GET'
    });
    console.log('✅ Connected to Sanity API');
    
    // Check our specific project
    const projectInfo = await client.request({
      uri: `/projects/li2bkslz`,
      method: 'GET'
    });
    console.log('📊 Project info:', JSON.stringify(projectInfo, null, 2));
    
    // Check existing documents
    const documents = await client.fetch('*[_type == "homepageSettings"]');
    console.log('📄 Existing homepage documents:', documents);
    
    // Check existing schemas/types
    const allDocs = await client.fetch('*[0...10]{ _type }');
    const types = [...new Set(allDocs.map(doc => doc._type))];
    console.log('🏗️  Document types found:', types);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.statusCode) {
      console.error('   Status:', error.statusCode);
    }
  }
}

checkSanitySetup();