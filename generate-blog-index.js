const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

const blogPostsDir = path.join(__dirname, '_posts/blog');
const outputDir = path.join(__dirname, 'blog'); // Directory for HTML files
const indexFile = path.join(blogPostsDir, 'index.json');

function generateBlogIndex() {
  const posts = [];

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read all Markdown files
  fs.readdirSync(blogPostsDir).forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(blogPostsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, content: markdownContent } = matter(content);

      // Determine content type and generate HTML content accordingly
      let htmlContent = '';
      if (data.content_type === 'pdf' && data.pdf) {
        // Embed or link to the PDF
        htmlContent = `
          <div class="pdf-embed-container">
            <p><a href="${data.pdf}" target="_blank" rel="noopener">View PDF</a></p>
            <iframe src="${data.pdf}" width="100%" height="800px" style="border:none;"></iframe>
          </div>
        `;
      } else {
        // Default: render markdown (do not change this logic)
        htmlContent = marked.parse(markdownContent);
      }

      // Generate the HTML file
      const htmlFileName = file.replace('.md', '.html');
      const htmlFilePath = path.join(outputDir, htmlFileName);
      const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || 'Untitled Post'} - Zafran Ullah Khattak, MPhil</title>
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
            <h1 class="blog-post-title">${data.title}</h1>
            <div class="blog-post-meta">
                Published on ${data.date ? new Date(data.date).toLocaleDateString() : ''}
            </div>
            <div class="blog-post-meta">
                ${data.thumbnail ? `<img src="${data.thumbnail}" alt="Featured Image" class="blog-post-image">` : ''}
            </div>
            <div class="blog-post-meta">
                Published by ${data.author || ''}
            </div>
        </div>
        <div class="blog-post-content">
        ${htmlContent}
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

      fs.writeFileSync(htmlFilePath, htmlTemplate);

      // Add the post to the index
      posts.push({
        title: data.title || 'Untitled Post',
        date: data.date || new Date().toISOString(),
        url: `/blog/${htmlFileName}`,
        thumbnail: data.thumbnail || null,
        excerpt: data.excerpt || (markdownContent ? markdownContent.substring(0, 150) + '...' : ''),
        content_type: data.content_type || 'body',
        pdf: data.pdf || null
      });
    }
  });

  // Write the index.json file
  fs.writeFileSync(indexFile, JSON.stringify(posts, null, 2));
  console.log('Blog index and HTML files generated.');
}

generateBlogIndex();