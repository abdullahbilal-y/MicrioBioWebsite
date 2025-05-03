document.addEventListener('DOMContentLoaded', function() {
  // Only try to load blog posts on the blog page
  const blogPostsContainer = document.getElementById('blog-posts');
  
  if (blogPostsContainer) {
    // Try to load from _posts/blog/index.json
    fetch('/_posts/blog/index.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Blog index not found');
        }
        return response.json();
      })
      .then(posts => {
        if (posts && posts.length > 0) {
          blogPostsContainer.innerHTML = posts.map(post => `
            <article class="blog-preview">
              <a href="${post.url || '#'}">
                ${post.thumbnail ? `<img src="${post.thumbnail}" alt="${post.title}" class="blog-thumbnail">` : ''}
                <h2>${post.title || 'Untitled Post'}</h2>
                <div class="blog-meta">
                  Published on ${new Date(post.date).toLocaleDateString()}
                </div>
                <p>${post.excerpt || 'No preview available'}</p>
                <span class="read-more">Read more →</span>
              </a>
            </article>
          `).join('');
        } else {
          blogPostsContainer.innerHTML = '<div class="no-posts">No blog posts available yet.</div>';
        }
      })
      .catch(error => {
        console.error('Error loading blog posts:', error);
        blogPostsContainer.innerHTML = '<div class="blog-error">Error loading blog posts. Please try again later.</div>';
      });
  }
});