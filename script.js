const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const portfolioAudio = document.querySelector('#portfolio-audio');
const trackButtons = [...document.querySelectorAll('.track-button')];
const playerStatus = document.querySelector('.player-status');
let activeTrack = null;

function resetTrackButtons() {
  trackButtons.forEach((button) => {
    button.classList.remove('is-playing');
    button.querySelector('.track-play').textContent = '▶';
  });
}

if (portfolioAudio) {
  trackButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const isCurrentTrack = activeTrack === button;

      if (isCurrentTrack && !portfolioAudio.paused) {
        portfolioAudio.pause();
        resetTrackButtons();
        playerStatus.textContent = 'PAUSED';
        return;
      }

      if (!isCurrentTrack) {
        portfolioAudio.src = button.dataset.audioSrc;
        activeTrack = button;
      }

      resetTrackButtons();
      button.classList.add('is-playing');
      button.querySelector('.track-play').textContent = 'Ⅱ';
      playerStatus.textContent = 'NOW PLAYING';

      try {
        await portfolioAudio.play();
      } catch {
        resetTrackButtons();
        playerStatus.textContent = 'AUDIO UNAVAILABLE';
      }
    });
  });

  portfolioAudio.addEventListener('ended', () => {
    resetTrackButtons();
    playerStatus.textContent = 'SELECT A TRACK';
  });
}
