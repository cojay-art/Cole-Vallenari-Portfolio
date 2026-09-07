/* ==========================================================
   This file does one thing: click an image, see it big.

   It finds every image in the work section automatically,
   so when you add a piece it's included with no changes here.
   You shouldn't need to touch this file.
   ========================================================== */

const figures = [...document.querySelectorAll('.hang figure')];
const box     = document.getElementById('lightbox');
const bigImg  = document.getElementById('lbImg');
const caption = document.getElementById('lbCap');

let current = 0;

function showPiece(index) {
  current = (index + figures.length) % figures.length;   // wraps around the ends

  const figure = figures[current];
  bigImg.src = figure.querySelector('img').src;
  bigImg.alt = figure.querySelector('img').alt;
  caption.innerHTML = figure.querySelector('figcaption').innerHTML;
}

function openViewer(index) {
  showPiece(index);
  box.hidden = false;
  document.body.classList.add('is-locked');
  document.getElementById('lbClose').focus();
}

function closeViewer() {
  box.hidden = true;
  document.body.classList.remove('is-locked');
}

// Click any piece to open it
figures.forEach((figure, index) => {
  figure.addEventListener('click', () => openViewer(index));
});

// The three buttons
document.getElementById('lbClose').addEventListener('click', closeViewer);
document.getElementById('lbPrev').addEventListener('click', () => showPiece(current - 1));
document.getElementById('lbNext').addEventListener('click', () => showPiece(current + 1));

// Click the dark background to close
box.addEventListener('click', (event) => {
  if (event.target === box) closeViewer();
});

// Escape closes, arrow keys move between pieces
document.addEventListener('keydown', (event) => {
  if (box.hidden) return;
  if (event.key === 'Escape')     closeViewer();
  if (event.key === 'ArrowLeft')  showPiece(current - 1);
  if (event.key === 'ArrowRight') showPiece(current + 1);
});
