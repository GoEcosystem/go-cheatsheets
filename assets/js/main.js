document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for header
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add active class to current nav item based on URL
  const currentPath = window.location.pathname;
  document.querySelectorAll('.site-nav a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath && (currentPath === linkPath || currentPath.startsWith(linkPath) && linkPath !== '/')) {
      link.classList.add('active');
    }
  });
});
