const links = document.querySelectorAll('nav a');
const content = document.getElementById('content');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = e.target.getAttribute('data-page');

    // Load content without .html extension
    fetch(`${page}.html`)
      .then(response => response.text())
      .then(data => {
        content.innerHTML = data;
        history.pushState(null, '', `/${page}`);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
});

// Handle browser back and forward navigation
window.addEventListener('popstate', () => {
  const path = window.location.pathname.slice(1);
  const page = path ? path : 'home';

  fetch(`${page}.html`)
    .then(response => response.text())
    .then(data => {
      content.innerHTML = data;
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
