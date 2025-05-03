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
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${data.title}</title>
        </head>
        <body>
          <h1>${data.title}</h1>
          <p><em>Published on ${new Date(data.date).toLocaleDateString()}</em></p>
          ${htmlContent}
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