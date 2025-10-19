fetch('https://youtomb-mobile.github.io/nosearch.txt')
  .then(response => response.text())
  .then(text => {
    const trimmed = text.trim().toLowerCase();
    if (trimmed === 'true' || trimmed === 'yes' || trimmed === '1') {
      document.querySelectorAll('.search-button').forEach(btn => btn.disabled = true);
    }
  })
  .catch(err => console.error('Error fetching nosearch.txt:', err));
