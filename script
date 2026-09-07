const lightbox = document.getElementById('lightbox');
const lightboxFrame = document.getElementById('lightboxFrame');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.piece').forEach((piece) => {
  piece.style.cursor = 'zoom-in';
  piece.addEventListener('click', () => {
    const image = piece.querySelector('.piece-image');
    lightboxFrame.style.backgroundImage = getComputedStyle(image).backgroundImage;
    lightbox.classList.add('is-open');
  });
});

function closeLightbox() {
  lightbox.classList.remove('is-open');
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
