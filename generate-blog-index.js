const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directories containing blog posts
const POST_DIRS = [
  path.join(process.cwd(), '_posts/blog'),
  path.join(process.cwd(), 'posts')
];

// Output files for the index
const OUTPUT_FILES = [
  path.join(process.cwd(), '_posts/blog/index.json'),
  path.join(process.cwd(), 'posts/index.json')
];

// Ensure the directories exist
POST_DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Get all posts from both directories
let allPosts = [];

POST_DIRS.forEach(dirPath => {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath)
      .filter(filename => filename.endsWith('.md') && filename !== 'index.md');
    
    files.forEach(filename => {
      const filePath = path.join(dirPath, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      try {
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
        
        // Add the post data
        allPosts.push({
          title: data.title || 'Untitled',
          date: data.date || new Date(),
          url: url,
          thumbnail: data.thumbnail || null,
          excerpt: excerpt
        });
      } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
      }
    });
  }
});

// Sort posts by date (newest first)
allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write the index files
OUTPUT_FILES.forEach(outputFile => {
  const dir = path.dirname(outputFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputFile, JSON.stringify(allPosts, null, 2));
});

console.log(`Generated index with ${allPosts.length} posts`);