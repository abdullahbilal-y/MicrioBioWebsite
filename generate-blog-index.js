const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directory containing blog posts
const POSTS_DIR = path.join(process.cwd(), '_posts/blog');
// Output file for the index
const OUTPUT_FILE = path.join(process.cwd(), '_posts/blog/index.json');

// Ensure the directory exists
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// Get all .md files in the posts directory
const postFiles = fs.readdirSync(POSTS_DIR)
  .filter(filename => filename.endsWith('.md'));

// Parse each post file
const posts = postFiles.map(filename => {
  const filePath = path.join(POSTS_DIR, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  // Parse frontmatter
  const { data, content } = matter(fileContents);
  
  // Generate a URL for the post
  const slug = filename.replace(/\.md$/, '');
  const url = `/blog/${slug}`;
  
  // Create an excerpt (first 150 characters)
  const excerpt = content
    .replace(/[#*_`]/g, '') // Remove markdown formatting
    .trim()
    .slice(0, 150)
    .trim() + '...';
  
  // Return the post data
  return {
    title: data.title,
    date: data.date,
    url: url,
    thumbnail: data.thumbnail || null,
    excerpt: excerpt
  };
});

// Sort posts by date (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write the index file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));
console.log(`Generated index with ${posts.length} posts`);