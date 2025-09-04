# Monica Leggett Blog System - Technical Implementation

## Blog Data Structure

### Blog Post Schema
```json
{
  "id": "post-2025-01-15-001",
  "title": "Finding Your Purpose After 50",
  "slug": "finding-purpose-after-50",
  "content": "Rich text HTML content...",
  "excerpt": "Auto-generated or custom 160 chars",
  "author": "Monica Leggett",
  "publishedAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z",
  "status": "published|draft|scheduled",
  "featuredImage": "/images/blog/purpose-after-50.jpg",
  "categories": ["Personal Growth"],
  "tags": ["midlife", "purpose", "transformation"],
  "seo": {
    "metaTitle": "Custom or auto from title",
    "metaDescription": "Custom or auto from excerpt"
  },
  "viewCount": 234
}
```

### Category Schema
```json
{
  "id": "personal-growth",
  "name": "Personal Growth",
  "slug": "personal-growth",
  "description": "Posts about personal development and growth",
  "postCount": 15
}
```

### Tag Schema
```json
{
  "id": "mindset",
  "name": "mindset",
  "slug": "mindset",
  "postCount": 23
}
```

## Frontend Blog Features

### 1. Blog Homepage (`/blog`)
```jsx
// Search with debounce
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

// Filter state
const [selectedCategory, setSelectedCategory] = useState('all');
const [selectedTags, setSelectedTags] = useState([]);

// Pagination
const [page, setPage] = useState(1);
const postsPerPage = 9;

// Filtered posts
const filteredPosts = posts.filter(post => {
  const matchesSearch = post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                        post.content.toLowerCase().includes(debouncedSearch.toLowerCase());
  const matchesCategory = selectedCategory === 'all' || post.categories.includes(selectedCategory);
  const matchesTags = selectedTags.length === 0 || 
                      selectedTags.some(tag => post.tags.includes(tag));
  
  return matchesSearch && matchesCategory && matchesTags;
});
```

### 2. Search Implementation
```jsx
// Instant search with highlighting
function BlogSearch({ posts, onResultsChange }) {
  const searchIndex = useMemo(() => {
    // Build search index from posts
    return posts.map(post => ({
      id: post.id,
      searchableText: `${post.title} ${post.content} ${post.tags.join(' ')}`.toLowerCase(),
      ...post
    }));
  }, [posts]);

  const handleSearch = (query) => {
    if (!query) {
      onResultsChange(posts);
      return;
    }
    
    const results = searchIndex.filter(post => 
      post.searchableText.includes(query.toLowerCase())
    );
    onResultsChange(results);
  };
}
```

### 3. Category & Tag Filters
```jsx
// Tag cloud with post counts
function TagCloud({ tags, selectedTags, onTagToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <button
          key={tag.id}
          onClick={() => onTagToggle(tag.id)}
          className={`
            px-3 py-1 rounded-full text-sm
            ${selectedTags.includes(tag.id) 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'}
          `}
        >
          #{tag.name} ({tag.postCount})
        </button>
      ))}
    </div>
  );
}
```

### 4. Blog Post Card
```jsx
function BlogCard({ post }) {
  return (
    <article className="bg-white rounded-lg shadow hover:shadow-lg transition">
      <img 
        src={post.featuredImage} 
        alt={post.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <div className="flex gap-2 mb-2">
          {post.categories.map(cat => (
            <span key={cat} className="text-xs text-blue-600 uppercase">
              {cat}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <div className="flex justify-between items-center">
          <time className="text-sm text-gray-500">
            {formatDate(post.publishedAt)}
          </time>
          <a href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
            Read More →
          </a>
        </div>
      </div>
    </article>
  );
}
```

### 5. Related Posts Algorithm
```javascript
function getRelatedPosts(currentPost, allPosts, limit = 3) {
  // Score posts by relevance
  const scored = allPosts
    .filter(post => post.id !== currentPost.id)
    .map(post => {
      let score = 0;
      
      // Same category = 10 points
      currentPost.categories.forEach(cat => {
        if (post.categories.includes(cat)) score += 10;
      });
      
      // Shared tags = 5 points each
      currentPost.tags.forEach(tag => {
        if (post.tags.includes(tag)) score += 5;
      });
      
      // Recent posts get slight boost
      const daysDiff = Math.abs(
        new Date(post.publishedAt) - new Date(currentPost.publishedAt)
      ) / (1000 * 60 * 60 * 24);
      if (daysDiff < 30) score += 2;
      
      return { ...post, score };
    })
    .sort((a, b) => b.score - a.score);
  
  return scored.slice(0, limit);
}
```

## CMS Blog Editor Features

### 1. Rich Text Editor Config
```javascript
// TinyMCE or similar configuration
const editorConfig = {
  plugins: 'link image lists bullist numlist blockquote',
  toolbar: 'bold italic underline | link | bullist numlist | blockquote | image',
  menubar: false,
  statusbar: false,
  height: 500,
  // Auto-save every 30 seconds
  autosave_interval: '30s',
  autosave_retention: '1440m', // Keep for 24 hours
  // Simple image upload
  images_upload_handler: async (blobInfo) => {
    const formData = new FormData();
    formData.append('image', blobInfo.blob());
    const response = await fetch('/api/upload', { 
      method: 'POST', 
      body: formData 
    });
    const { url } = await response.json();
    return url;
  }
};
```

### 2. Tag Autocomplete
```javascript
function TagInput({ existingTags, selectedTags, onChange }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const handleInputChange = (value) => {
    setInput(value);
    // Show suggestions based on existing tags
    const filtered = existingTags.filter(tag =>
      tag.toLowerCase().includes(value.toLowerCase()) &&
      !selectedTags.includes(tag)
    );
    setSuggestions(filtered.slice(0, 5));
  };
  
  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
    setInput('');
    setSuggestions([]);
  };
}
```

### 3. Post Scheduling
```javascript
function PostScheduler({ onSchedule }) {
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  const handleSchedule = () => {
    const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (dateTime > new Date()) {
      onSchedule(dateTime.toISOString());
    } else {
      alert('Please select a future date and time');
    }
  };
  
  return (
    <div className="flex gap-2">
      <input 
        type="date" 
        value={scheduledDate}
        min={new Date().toISOString().split('T')[0]}
        onChange={(e) => setScheduledDate(e.target.value)}
      />
      <input 
        type="time"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
      />
      <button onClick={handleSchedule}>Schedule</button>
    </div>
  );
}
```

## Database Storage (Netlify Blobs)

### Blog Post Storage
```javascript
// Store blog posts in Netlify Blobs
async function saveBlogPost(post) {
  const store = getStore('blog-posts');
  await store.setJSON(post.id, post);
  
  // Update category counts
  await updateCategoryCounts(post.categories);
  
  // Update tag counts
  await updateTagCounts(post.tags);
  
  // Trigger rebuild for static site
  await triggerNetlifyBuild();
}

// Get all posts with filtering
async function getBlogPosts(filters = {}) {
  const store = getStore('blog-posts');
  const posts = await store.list();
  
  let filtered = posts;
  
  if (filters.category) {
    filtered = filtered.filter(p => 
      p.categories.includes(filters.category)
    );
  }
  
  if (filters.tags?.length) {
    filtered = filtered.filter(p =>
      filters.tags.some(tag => p.tags.includes(tag))
    );
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchLower) ||
      p.content.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by date
  filtered.sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  
  return filtered;
}
```

## SEO Implementation

### Blog Post SEO
```jsx
// Individual blog post head tags
export async function generateMetadata({ params }) {
  const post = await getBlogPost(params.slug);
  
  return {
    title: post.seo?.metaTitle || `${post.title} | Monica Leggett`,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Monica Leggett'],
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage]
    }
  };
}
```

### Structured Data
```jsx
// JSON-LD for blog posts
function BlogPostSchema({ post }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featuredImage,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": "Monica Leggett",
      "url": "https://monicaleggett.com/about"
    },
    "publisher": {
      "@type": "Person",
      "name": "Monica Leggett"
    },
    "keywords": post.tags.join(', ')
  };
  
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

## Performance Optimizations

### 1. Static Generation with ISR
```javascript
// Generate static pages at build time
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map(post => ({
    slug: post.slug
  }));
}

// Revalidate every hour
export const revalidate = 3600;
```

### 2. Image Optimization
```javascript
// Automatic image optimization on upload
async function optimizeImage(file) {
  const sharp = require('sharp');
  
  // Create multiple sizes
  const sizes = [
    { name: 'thumb', width: 300 },
    { name: 'card', width: 600 },
    { name: 'full', width: 1200 }
  ];
  
  const optimized = {};
  
  for (const size of sizes) {
    const buffer = await sharp(file.buffer)
      .resize(size.width)
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();
    
    optimized[size.name] = await uploadToStorage(buffer);
  }
  
  return optimized;
}
```

This gives Monica a blog system that's:
- **Searchable** - Full text search across titles, content, and tags
- **Filterable** - By category, tags, or combinations
- **Taggable** - With autocomplete and suggestions
- **SEO-optimized** - Automatic meta tags and structured data
- **Fast** - Static generation with smart caching
- **Simple to use** - Clean CMS interface she can't break