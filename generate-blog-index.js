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

      // Convert Markdown to HTML
      const htmlContent = marked.parse(markdownContent);

      // Generate the HTML file
      const htmlFileName = file.replace('.md', '.html');
      const htmlFilePath = path.join(outputDir, htmlFileName);
      const htmlTemplate = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Antimicrobial Resistance: A Global Health Crisis - Zafran Ullah Khattak, MPhil</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="../style.css" />
  <script type="text/javascript" src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>

</head>

<body>
  <header>
    <div class="navbar">
      <div class="logo">Zafran Ullah Khattak, MPhil</div>
      <nav>
        <a href="../index.html">Home</a>
        <a href="../about.html">About</a>
        <a href="../qualifications.html">Qualifications</a>
        <a href="../blog.html" class="current">Research Blog</a>
        <a href="../contact.html">Contact</a>
        <li class="login-item"><button class="netlify-identity-button">Login</button></li>
      </nav>
    </div>
  </header>
          <head>
          <title>${data.title}</title>
        </head>
        <body>
          <h1>${data.title}</h1>
          <p><em>Published on ${new Date(data.date).toLocaleDateString()}</em></p>
          ${htmlContent}
          <footer>
    <div class="footer-content">
      <div class="footer-info">
        <h3>Zafran Ullah Khattak, MPhil</h3>
        <p>Microbiologist</p>
      </div>
      <div class="footer-nav">
        <a href="../about.html">About</a>
        <a href="../qualifications.html">Qualifications</a>
        <a href="../blog.html">Research Blog</a>
        <a href="../contact.html">Contact</a>
      </div>
    </div>
    <div class="copyright">
      <p>&copy; 2025 Zafran Ullah Khattak. All rights reserved.</p>
    </div>
  </footer>
  
  <script src="../auth.js"></script>
        </body>
        </html>
      `;
      fs.writeFileSync(htmlFilePath, htmlTemplate);

      // Add the post to the index
      posts.push({
        title: data.title || 'Untitled Post',
        date: data.date || new Date().toISOString(),
        url: `/blog/${htmlFileName}`,
        thumbnail: data.thumbnail || null,
        excerpt: data.excerpt || markdownContent.substring(0, 150) + '...',
      });
    }
  });

  // Write the index.json file
  fs.writeFileSync(indexFile, JSON.stringify(posts, null, 2));
  console.log('Blog index and HTML files generated.');
}

generateBlogIndex();