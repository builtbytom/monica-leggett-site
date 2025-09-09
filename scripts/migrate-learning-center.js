import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const client = createClient({
  projectId: 'li2bkslz',
  dataset: 'production',
  useCdn: false,
  token: 'skKqet07GvU7mrd4XEjhRuZ0UuUhzeCrHAm0qRtV6doD6rhzJL3Zxs5bx4IeLewQ1yagc1urVDjEIJ7xvBNaJwx8WgSb7YUITZH80w2hpk262HKLFlRIqnQZ4oN5peCSYX7vtJtvpymvIz7f5Mm1oH0QzAeyghcGACOZGlEmZI1aLATA8w5c'
});

// Helper to convert markdown content to Sanity portable text blocks
function markdownToPortableText(markdown) {
  // This is a simplified conversion - in production you'd want to use a proper markdown-to-portable-text converter
  const lines = markdown.split('\n');
  const blocks = [];
  
  let currentBlock = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed === '') {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }
    
    // Headers
    if (trimmed.startsWith('## ')) {
      if (currentBlock) blocks.push(currentBlock);
      blocks.push({
        _type: 'block',
        _key: Math.random().toString(36).substr(2, 9),
        style: 'h2',
        children: [{
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text: trimmed.substring(3),
          marks: []
        }]
      });
      currentBlock = null;
    }
    else if (trimmed.startsWith('### ')) {
      if (currentBlock) blocks.push(currentBlock);
      blocks.push({
        _type: 'block',
        _key: Math.random().toString(36).substr(2, 9),
        style: 'h3',
        children: [{
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text: trimmed.substring(4),
          marks: []
        }]
      });
      currentBlock = null;
    }
    // List items
    else if (trimmed.startsWith('- ')) {
      if (currentBlock && currentBlock.listItem !== 'bullet') {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      
      blocks.push({
        _type: 'block',
        _key: Math.random().toString(36).substr(2, 9),
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: [{
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text: trimmed.substring(2),
          marks: []
        }]
      });
    }
    // Regular paragraphs
    else {
      if (!currentBlock) {
        currentBlock = {
          _type: 'block',
          _key: Math.random().toString(36).substr(2, 9),
          style: 'normal',
          children: []
        };
      }
      
      if (currentBlock.children.length > 0) {
        currentBlock.children.push({
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text: ' ',
          marks: []
        });
      }
      
      // Simple bold/italic parsing
      let text = trimmed;
      let marks = [];
      
      if (text.includes('**')) {
        text = text.replace(/\*\*(.*?)\*\*/g, '$1');
        marks.push('strong');
      }
      
      currentBlock.children.push({
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: text,
        marks: marks
      });
    }
  }
  
  if (currentBlock) {
    blocks.push(currentBlock);
  }
  
  return blocks;
}

// Helper to create a URL-friendly slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function migrateArticles() {
  const learningCenterPath = path.join(process.cwd(), 'src/content/learning-center');
  
  try {
    const files = fs.readdirSync(learningCenterPath);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`📚 Found ${markdownFiles.length} articles to migrate`);
    
    for (const file of markdownFiles) {
      const filePath = path.join(learningCenterPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);
      
      console.log(`\n📄 Processing: ${frontmatter.title}`);
      
      const document = {
        _type: 'learningCenterArticle',
        title: frontmatter.title,
        slug: {
          _type: 'slug',
          current: frontmatter.slug || createSlug(frontmatter.title)
        },
        description: frontmatter.description,
        content: markdownToPortableText(content),
        publishedDate: frontmatter.publishedDate,
        category: frontmatter.category,
        step: frontmatter.step || null,
        readTime: frontmatter.readTime,
        featured: frontmatter.featured || false,
        metaDescription: frontmatter.metaDescription || frontmatter.description
      };
      
      try {
        const result = await client.create(document);
        console.log(`✅ Created: ${result.title} (${result._id})`);
      } catch (error) {
        console.error(`❌ Error creating ${frontmatter.title}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Migration complete! All articles have been moved to Sanity CMS.`);
    console.log(`\nMonica can now edit these articles at: http://localhost:3333/`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrateArticles();