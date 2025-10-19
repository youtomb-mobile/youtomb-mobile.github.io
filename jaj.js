let buttonsDisabled = false;

fetch('https://youtomb-mobile.github.io/nosearch.txt')
  .then(response => response.text())
  .then(text => {
    const trimmed = text.trim().toLowerCase();
    if (trimmed === 'true' || trimmed === 'yes' || trimmed === '1') {
      toggleButtons(true);
    }
  })
  .catch(err => console.error('Error fetching nosearch.txt:', err));

function toggleButtons(disable) {
  document.querySelectorAll('.search-button').forEach(btn => btn.disabled = disable);
  buttonsDisabled = disable;
}

document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key.toLowerCase() === 'n') {
    buttonsDisabled = !buttonsDisabled;
    toggleButtons(buttonsDisabled);
  }
});
