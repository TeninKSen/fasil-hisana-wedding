// Edit these details when your wedding arrangements are final.
const WEDDING = {
  date: '2026-08-29T16:00:00+05:30', 
  endDate: '2026-08-29T20:00:00+05:30', 
  mapUrl: 'https://maps.app.goo.gl/w2nGKJNwymkxXnYU6?g_st=ic',
  title: 'Fasil & Hisana Wedding',
  location: 'Grand View Convention Center, Chattipparamba, Malappuram',
  description: 'Join us in celebrating the wedding of Fasil & Hisana.' 
};

const cover = document.querySelector('#cover');
const invitation = document.querySelector('#invitation');
const music = document.querySelector('#background-music');
const musicButton = document.querySelector('#music-button');
let opened = false;

async function playMusic() {
  try {
    await music.play();
    musicButton.classList.add('playing');
    musicButton.setAttribute('aria-pressed', 'true');
    musicButton.querySelector('t').textContent = '🔇';
  } catch {
    musicButton.querySelector('t').textContent = '🔈';
  }
}

function openInvitation() {
  if (opened) return;
  opened = true;
  cover.classList.add('open');
  invitation.setAttribute('aria-hidden', 'false');
  playMusic();
}

cover.addEventListener('click', openInvitation);
cover.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') openInvitation();
});

// Fixes the map button destination
document.querySelector('#map-link').href = WEDDING.mapUrl;

function updateCountdown() {
  let remaining = Math.max(0, new Date(WEDDING.date).getTime() - Date.now());
  const units = { days: 86400000, hours: 3600000, minutes: 60000, seconds: 1000 };
  for (const [name, milliseconds] of Object.entries(units)) {
    const amount = Math.floor(remaining / milliseconds);
    remaining %= milliseconds;
    document.querySelector(`#${name}`).textContent = String(amount).padStart(name === 'days' ? 2 : 2, '0');
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

musicButton.addEventListener('click', async () => {
  if (music.paused) {
    await playMusic();
  } else {
    music.pause();
    musicButton.classList.remove('playing');
    musicButton.setAttribute('aria-pressed', 'false');
    musicButton.querySelector('t').textContent = '🔈';
  }
});

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(section => observer.observe(section));

// Fixed comet scroll mechanic
let cometTicking = false;

// Replace moveComet in script.js

function moveComet() {
  const wrapper = document.querySelector('.story-wrapper');
  if (!wrapper) return;

  const scrollableDistance = Math.max(1, wrapper.scrollHeight - wrapper.clientHeight);
  const progress = Math.min(1, wrapper.scrollTop / scrollableDistance);
  
  const percentage = (progress * 100).toFixed(1) + '%';
  
  const cometElement = document.querySelector('#comet');
  if (cometElement) {
    cometElement.style.setProperty('--comet-progress', percentage);
  }
  
  cometTicking = false;
}

// Listen to scroll events on .story-wrapper instead of window
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.story-wrapper');
  if (wrapper) {
    wrapper.addEventListener('scroll', () => {
      if (!cometTicking) {
        requestAnimationFrame(moveComet);
        cometTicking = true;
      }
    }, { passive: true });
  }  
});

moveComet();


function updateViewportHeight() {
    const vh = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;

    document.documentElement.style.setProperty(
        '--app-height',
        `${vh}px`
    );
}

updateViewportHeight();

window.addEventListener('resize', updateViewportHeight);

if (window.visualViewport) {
    window.visualViewport.addEventListener(
        'resize',
        updateViewportHeight
    );
}

function formatICSDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function createCalendarEvent() {

    const start = new Date(WEDDING.date);
    const end = new Date(WEDDING.endDate);

    const ics =
`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${WEDDING.title}
DESCRIPTION:${WEDDING.description}
LOCATION:${WEDDING.location}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([ics], { type: 'text/calendar' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Fasil-Hisana-Wedding.ics';
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.getElementById('calendar-link').addEventListener('click', e => {
        e.preventDefault();
        createCalendarEvent();
    });