
fetch('/_posts/index.json')
  .then(response => response.json())
  .then(posts => {
    const container = document.getElementById('blog-posts');
    container.innerHTML = posts.map(post => (
      `<article><h2>${post.title}</h2><p>${post.excerpt}</p></article>`
    )).join('');
  });
