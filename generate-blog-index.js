// generate-blog-index.js with Markdown to HTML conversion
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked'); // Add this package for Markdown conversion

// Directories containing blog posts
const POSTS_DIR = path.join(process.cwd(), '_posts/blog');
// Output file for the index
const OUTPUT_FILE = path.join(process.cwd(), '_posts/blog/index.json');

// HTML Template for individual blog posts
const BLOG_POST_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - Zafran Ullah Khattak, MPhil</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="/style.css">
    <script type="text/javascript" src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
    <style>
        /* Blog post specific styles */
        .blog-post-container {
            max-width: 800px;
            margin: 100px auto 50px;
            padding: 0 20px;
        }
        
        .blog-post-header {
            margin-bottom: 30px;
        }
        
        .blog-post-title {
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 10px;
        }
        
        .blog-post-meta {
            color: #666;
            font-size: 1rem;
            margin-bottom: 20px;
        }
        
        .blog-post-image {
            width: 100%;
            border-radius: 10px;
            margin-bottom: 30px;
            max-height: 500px;
            object-fit: cover;
        }
        
        .blog-post-content {
            line-height: 1.8;
            color: #333;
        }
        
        .blog-post-content h2 {
            margin-top: 40px;
            margin-bottom: 20px;
            color: #444;
        }
        
        .blog-post-content h3 {
            margin-top: 30px;
            margin-bottom: 15px;
            color: #555;
        }
        
        .blog-post-content p {
            margin-bottom: 20px;
        }
        
        .blog-post-content ul, .blog-post-content ol {
            margin-bottom: 20px;
            padding-left: 25px;
        }
        
        .blog-post-content li {
            margin-bottom: 10px;
        }
        
        .blog-post-content blockquote {
            border-left: 5px solid #F3C693;
            padding-left: 20px;
            margin-left: 0;
            margin-right: 0;
            font-style: italic;
            color: #555;
        }
        
        .blog-post-content img {
            max-width: 100%;
            border-radius: 5px;
            margin: 20px 0;
        }
        
        .blog-post-content code {
            background-color: #f4f4f4;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
        }
        
        .blog-post-content pre {
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin-bottom: 20px;
        }
        
        .blog-post-content a {
            color: #F3C693;
            text-decoration: none;
        }
        
        .blog-post-content a:hover {
            text-decoration: underline;
        }
        
        .blog-post-footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #eee;
        }
        
        .blog-nav-links {
            display: flex;
            justify-content: space-between;
        }
        
        .blog-nav-links a {
            color: #F3C693;
            text-decoration: none;
            display: inline-block;
            padding: 10px 15px;
            border: 1px solid #F3C693;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        
        .blog-nav-links a:hover {
            background-color: #F3C693;
            color: #fff;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .blog-post-title {
                font-size: 2rem;
            }
            
            .blog-post-container {
                margin-top: 80px;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="navbar">
            <div class="logo">Zafran Ullah Khattak, MPhil</div>
            <nav>
                <a href="/index.html">Home</a>
                <a href="/about.html">About</a>
                <a href="/qualifications.html">Qualifications</a>
                <a href="/blog.html">Research Blog</a>
                <a href="/contact.html">Contact</a>
                <li class="login-item"><button class="netlify-identity-button">Login</button></li>
            </nav>
        </div>
    </header>

    <div class="blog-post-container">
        <div class="blog-post-header">
            <h1 class="blog-post-title">{{title}}</h1>
            <div class="blog-post-meta">
                Published on {{formattedDate}}
                {{#if author}}by {{author}}{{/if}}
            </div>
        </div>

        {{#if thumbnail}}
        <img src="{{thumbnail}}" alt="{{title}}" class="blog-post-image">
        {{/if}}

        <div class="blog-post-content">
            {{{contentHtml}}}
        </div>
        
        <div class="blog-post-footer">
            <div class="blog-nav-links">
                {{#if previousPost}}
                <a href="{{previousPost.url}}" class="prev-post">&larr; Previous Post</a>
                {{else}}
                <span></span>
                {{/if}}
                
                {{#if nextPost}}
                <a href="{{nextPost.url}}" class="next-post">Next Post &rarr;</a>
                {{else}}
                <span></span>
                {{/if}}
            </div>
        </div>
    </div>

    <footer>
        <div class="footer-content">
            <div class="footer-info">
                <h3>Zafran Ullah Khattak, MPhil</h3>
                <p>Microbiologist</p>
            </div>
            <div class="footer-nav">
                <a href="/about.html">About</a>
                <a href="/qualifications.html">Qualifications</a>
                <a href="/blog.html">Research Blog</a>
                <a href="/contact.html">Contact</a>
            </div>
        </div>
        <div class="copyright">
            <p>&copy; 2025 Zafran Ullah Khattak. All rights reserved.</p>
        </div>
    </footer>
    
    <script src="/auth.js"></script>
</body>
</html>`;

// Ensure the directory exists
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// Get all .md files in the posts directory
const postFiles = fs.readdirSync(POSTS_DIR)
  .filter(filename => filename.endsWith('.md') && filename !== 'index.md');

// Parse each post file
const posts = postFiles.map(filename => {
  const filePath = path.join(POSTS_DIR, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  try {
    // Parse frontmatter
    const { data, content } = matter(fileContents);
    
    // Convert Markdown to HTML
    const contentHtml = marked.parse(content);
    
    // Generate a slug for the post
    const slug = filename.replace(/\.md$/, '');
    const url = `/blog/${slug}.html`;
    
    // Create an excerpt (first 150 characters)
    const excerpt = content
      .replace(/[#*_`]/g, '') // Remove markdown formatting
      .trim()
      .slice(0, 150)
      .trim() + '...';
    
    // Format the date
    const date = data.date ? new Date(data.date) : new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    
    // Return the post data
    return {
      title: data.title || 'Untitled',
      date: date,
      formattedDate: formattedDate,
      url: url,
      slug: slug,
      thumbnail: data.thumbnail || null,
      author: data.author || null,
      excerpt: excerpt,
      content: content,
      contentHtml: contentHtml
    };
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
    return null;
  }
}).filter(Boolean); // Remove any null entries

// Sort posts by date (newest first)
posts.sort((a, b) => b.date - a.date);

// Add previous/next post links
posts.forEach((post, index) => {
  post.previousPost = index < posts.length - 1 ? posts[index + 1] : null;
  post.nextPost = index > 0 ? posts[index - 1] : null;
});

// Write the index file for the listing page
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts.map(post => ({
  title: post.title,
  date: post.date,
  url: post.url,
  thumbnail: post.thumbnail,
  excerpt: post.excerpt
})), null, 2));

// Create individual HTML files for each post
const BLOG_DIR = path.join(process.cwd(), 'blog');
if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
}

// Function to replace template variables with actual content
function applyTemplate(template, data) {
  // Handle conditionals
  template = template.replace(/\{\{#if ([^}]+)\}\}(.*?)\{\{else\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, ifContent, elseContent) => {
    const props = condition.split('.');
    let value = data;
    for (const prop of props) {
      value = value?.[prop];
    }
    return value ? ifContent : elseContent;
  });
  
  template = template.replace(/\{\{#if ([^}]+)\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, content) => {
    const props = condition.split('.');
    let value = data;
    for (const prop of props) {
      value = value?.[prop];
    }
    return value ? content : '';
  });
  
  // Handle variables
  template = template.replace(/\{\{\{([^}]+)\}\}\}/g, (match, key) => {
    const props = key.split('.');
    let value = data;
    for (const prop of props) {
      if (value === undefined || value === null) return '';
      value = value[prop];
    }
    return value !== undefined && value !== null ? value : '';
  });
  
  template = template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
    const props = key.split('.');
    let value = data;
    for (const prop of props) {
      if (value === undefined || value === null) return '';
      value = value[prop];
    }
    return value !== undefined && value !== null ? escapeHtml(value) : '';
  });
  
  return template;
}

// Helper function to escape HTML special characters.
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Generate HTML files for each post
posts.forEach(post => {
  const postHtml = applyTemplate(BLOG_POST_TEMPLATE, post);
  const outputPath = path.join(BLOG_DIR, `${post.slug}.html`);
  fs.writeFileSync(outputPath, postHtml);
});

console.log(`Generated index with ${posts.length} posts`);
console.log(`Generated ${posts.length} individual HTML blog post pages`);