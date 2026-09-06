import './reader-tools.css';
import './style.css';
import { PageFlip } from 'page-flip';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

document.querySelector('#app').innerHTML = `
  <div class="shell">
    <header class="topbar">
      <button class="mobile-menu top-mobile-menu" id="mobileMenu" aria-label="Open document navigation">☰</button>
      <div class="brand"><img class="brand-mark" src="/pagevera-mark.svg" alt="Pagevera" /><span class="brand-copy"><strong>Pagevera</strong><small>by Renz Acero</small></span></div>
      <div class="top-actions">
        <button class="icon-btn" id="openBtn" title="Open PDF"><span>＋</span> Open PDF</button>
        <input id="fileInput" type="file" accept="application/pdf" hidden />
        <button class="icon-btn" id="settingsBtn" title="Open appearance and sound settings">⚙ Settings</button>
        <button class="icon-btn" id="themeBtn" title="Toggle theme">◐</button>
      </div>
    </header>

    <main class="workspace">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-head"><div><span class="eyebrow">YOUR DOCUMENT</span><h2 id="docName">No PDF open</h2></div><button class="close-sidebar" id="closeSidebar">×</button></div>
        <div class="search-wrap"><span>⌕</span><input id="searchInput" placeholder="Search in document" /><span class="search-count" id="searchCount"></span></div>
        <div class="outline-title">PAGES <span id="thumbCount">0</span></div>
        <div class="thumbnails" id="thumbnails"><div class="empty-mini">Open a PDF to see pages here.</div></div><div class="sidebar-credit"><span>PAGEVERA READER</span><b>by Renz Acero</b></div>
      </aside>

      <section class="viewer-area">
        <div class="viewer-topline"><span id="statusText">Ready when you are</span><span class="format-pill">PDF</span></div>
        <div class="book-stage" id="bookStage">
          <div class="stage-backdrop" id="stageBackdrop"></div>
          <div class="empty-state" id="emptyState"><div class="empty-icon">▤</div><h1>Turn any PDF into a book.</h1><p>Upload a document to start reading in a beautiful, tactile flipbook.</p><button class="primary" id="emptyOpen">Choose a PDF <span>→</span></button></div>
          <div class="loading" id="loading"><div class="spinner"></div><span id="loadingText">Preparing your book…</span></div>
          <div id="flipbook" class="flipbook"></div>
        </div>
        <div class="controls" id="controls">
          <div class="control-group"><button class="control-btn" id="prevBtn" title="Previous page">‹</button><button class="control-btn" id="nextBtn" title="Next page">›</button></div>
          <div class="page-jump"><input id="pageInput" type="number" min="1" value="1" /><span>/</span><strong id="totalPages">0</strong></div>
          <div class="control-group"><button class="control-btn" id="zoomOut" title="Zoom out">−</button><span class="zoom-label" id="zoomLabel">100%</span><button class="control-btn" id="zoomIn" title="Zoom in">＋</button></div>
          <div class="control-spacer"></div>
          <div class="control-group"><button class="control-btn" id="fullscreenBtn" title="Fullscreen">⛶</button><button class="control-btn" id="printBtn" title="Print">⎙</button><button class="control-btn" id="downloadBtn" title="Download">⇩</button></div>
        </div>
      </section>
    </main>
    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

    <div class="settings-overlay" id="settingsOverlay"></div>
    <aside class="settings-panel" id="settingsPanel">
      <div class="settings-head"><div><span class="eyebrow">READER SETTINGS</span><h2>Make it yours</h2></div><button class="close-sidebar" id="closeSettings">×</button></div>
      <div class="settings-scroll">
        <section class="setting-section"><div class="section-title"><span class="section-icon">♪</span><div><strong>Flip sound</strong><small>Sound on every page turn</small></div><label class="switch"><input type="checkbox" id="flipSoundToggle" checked><span></span></label></div><label class="file-drop"><input id="flipSoundInput" type="file" accept="audio/mpeg,audio/wav,audio/ogg,audio/*"><span>＋</span><b id="flipSoundName">Use built-in flip sound</b><small>Upload MP3, WAV, or OGG</small></label><label class="range-row">Volume <input id="flipVolume" type="range" min="0" max="1" step="0.05" value="0.55"><output id="flipVolumeValue">55%</output></label></section>
        <section class="setting-section"><div class="section-title"><span class="section-icon">♫</span><div><strong>Background music</strong><small>Keep your reading atmosphere on loop</small></div><label class="switch"><input type="checkbox" id="musicLoop" checked><span></span></label></div><label class="file-drop"><input id="musicInput" type="file" accept="audio/mpeg,audio/wav,audio/ogg,audio/*"><span>＋</span><b id="musicName">Choose background music</b><small>Music stays in your browser</small></label><div class="music-actions"><button class="small-btn" id="musicPlay">▶ Play</button><button class="small-btn" id="musicStop">■ Stop</button><label class="range-row compact">Volume <input id="musicVolume" type="range" min="0" max="1" step="0.05" value="0.25"><output id="musicVolumeValue">25%</output></label></div></section>
        <section class="setting-section"><div class="section-title"><span class="section-icon">▧</span><div><strong>Preview background</strong><small>Set the mood behind your book</small></div></div><label class="file-drop"><input id="backgroundInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/*"><span>＋</span><b id="backgroundName">Upload a background image</b><small>JPG, PNG, WebP, or GIF</small></label><label class="range-row">Overlay <input id="overlayRange" type="range" min="0.15" max="0.85" step="0.05" value="0.48"><output id="overlayValue">48%</output></label><button class="reset-btn" id="resetBackground">Reset to default gradient</button></section>
      </div>
      <div class="settings-note">Everything stays local in this browser. Your PDF, image, and audio files are never uploaded.</div>
    </aside>
    <div class="toast" id="toast"></div>
  </div>
`;

const $ = (selector) => document.querySelector(selector);
const els = { fileInput: $('#fileInput'), flipbook: $('#flipbook'), emptyState: $('#emptyState'), loading: $('#loading'), loadingText: $('#loadingText'), docName: $('#docName'), statusText: $('#statusText'), controls: $('#controls'), thumbnails: $('#thumbnails'), thumbCount: $('#thumbCount'), totalPages: $('#totalPages'), pageInput: $('#pageInput'), searchInput: $('#searchInput'), searchCount: $('#searchCount'), zoomLabel: $('#zoomLabel'), bookStage: $('#bookStage'), stageBackdrop: $('#stageBackdrop'), sidebar: $('#sidebar'), toast: $('#toast'), settingsPanel: $('#settingsPanel'), settingsOverlay: $('#settingsOverlay'), sidebarBackdrop: $('#sidebarBackdrop') };
els.searchWrap = document.querySelector('.search-wrap');
els.searchWrap.insertAdjacentHTML('afterend', '<div class="search-results" id="searchResults"></div>');
els.searchResults = $('#searchResults');
els.outlineTitle = document.querySelector('.outline-title');
els.outlineTitle.innerHTML = '<button class="side-tab active" data-view="pages">PAGES <span id="thumbCountTab">0</span></button><button class="side-tab" data-view="bookmarks">BOOKMARKS <span id="bookmarkCount">0</span></button><button class="side-tab" data-view="notes">NOTES <span id="noteCount">0</span></button>';
els.library = document.createElement('div'); els.library.className = 'library-content'; els.library.hidden = true; els.thumbnails.after(els.library);
els.controls.insertAdjacentHTML('afterbegin', '<div class="control-group reader-tools"><button class="control-btn" id="bookmarkBtn" title="Bookmark this page">☆</button><button class="control-btn" id="noteBtn" title="Add note to this page">✎</button><button class="control-btn" id="highlightBtn" title="Highlight this page">▤</button></div>');
let pdf = null, pdfUrl = null, book = null, pageData = [], zoom = 1, toastTimer, flipSoundUrl = null, musicUrl = null, currentView = 'pages', currentPage = 0, bookmarks = [], notes = [], highlights = new Set();
let frameObserver = null, resizeFramePending = false, currentOrientation = null;
const music = new Audio(); music.loop = true; music.preload = 'auto';

function showToast(message) { els.toast.textContent = message; els.toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600); }
function setLoading(show, message = 'Preparing your book…') { els.loading.classList.toggle('visible', show); els.loadingText.textContent = message; }
function resetBook() { if (book) book.destroy(); book = null; els.flipbook.innerHTML = ''; els.thumbnails.innerHTML = ''; pageData = []; }
function storageKey(kind) { return `paperfold-${kind}-${els.docName.textContent}`; }
function loadReaderData() { try { bookmarks = JSON.parse(localStorage.getItem(storageKey('bookmarks')) || '[]'); notes = JSON.parse(localStorage.getItem(storageKey('notes')) || '[]'); highlights = new Set(JSON.parse(localStorage.getItem(storageKey('highlights')) || '[]')); } catch { bookmarks = []; notes = []; highlights = new Set(); } renderLibrary(); }
function saveReaderData() { localStorage.setItem(storageKey('bookmarks'), JSON.stringify(bookmarks)); localStorage.setItem(storageKey('notes'), JSON.stringify(notes)); localStorage.setItem(storageKey('highlights'), JSON.stringify([...highlights])); renderLibrary(); }
function renderLibrary() { const bookmarkCount = document.querySelector('#bookmarkCount'); const noteCount = document.querySelector('#noteCount'); const thumbCountTab = document.querySelector('#thumbCountTab'); if (bookmarkCount) bookmarkCount.textContent = bookmarks.length; if (noteCount) noteCount.textContent = notes.length; if (thumbCountTab) thumbCountTab.textContent = pageData.length; if (!els.library) return; const list = currentView === 'bookmarks' ? bookmarks.map((item, i) => ({ page: item.page, label: item.title || `Page ${item.page + 1}`, kind: 'bookmark', index: i })) : notes.map((item, i) => ({ page: item.page, label: item.text, kind: 'note', index: i })); els.library.innerHTML = list.length ? list.map(item => `<button class="library-item" data-page="${item.page}"><span class="library-icon">${item.kind === 'bookmark' ? '☆' : '✎'}</span><span><b>Page ${item.page + 1}</b><small>${item.label.replace(/[<>]/g, '')}</small></span></button>`).join('') : `<div class="library-empty">No ${currentView} yet.<br><small>Use the reader buttons below the book.</small></div>`; els.library.querySelectorAll('.library-item').forEach(button => button.onclick = () => { book?.turnToPage(Number(button.dataset.page)); }); }
function setReaderView(view) { currentView = view; els.thumbnails.hidden = view !== 'pages'; els.library.hidden = view === 'pages'; document.querySelectorAll('.side-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === view)); renderLibrary(); }
function renderSearchResults(term) { if (!term) { els.searchResults.innerHTML = ''; return; } const results = pageData.map((item, page) => ({ page, text: item.text })).filter(item => item.text.toLowerCase().includes(term)).slice(0, 30); els.searchResults.innerHTML = results.length ? results.map(result => { const at = result.text.toLowerCase().indexOf(term); const snippet = result.text.slice(Math.max(0, at - 32), at + term.length + 58); return `<button class="search-result" data-page="${result.page}"><b>Page ${result.page + 1}</b><span>${snippet.replace(/[<>]/g, '')}</span></button>`; }).join('') : '<div class="search-empty">No matching pages found.</div>'; els.searchResults.querySelectorAll('.search-result').forEach(button => button.onclick = () => { setReaderView('pages'); book?.turnToPage(Number(button.dataset.page)); }); }
function refreshPageAnnotations() { document.querySelectorAll('.page').forEach((page, index) => { page.classList.toggle('page-highlight', highlights.has(index)); page.classList.toggle('has-note', notes.some(note => note.page === index)); }); document.querySelectorAll('.thumbnail').forEach((thumb, index) => { thumb.classList.toggle('annotated', highlights.has(index)); thumb.classList.toggle('has-note', notes.some(note => note.page === index)); }); }
function toggleBookmark() { const found = bookmarks.findIndex(item => item.page === currentPage); if (found >= 0) { bookmarks.splice(found, 1); showToast('Bookmark removed'); } else { bookmarks.push({ page: currentPage, title: `Page ${currentPage + 1}` }); showToast('Page bookmarked'); } saveReaderData(); updateReaderButtons(); }
function addNote() { const text = window.prompt(`Add a note for page ${currentPage + 1}:`); if (!text?.trim()) return; notes.push({ page: currentPage, text: text.trim(), createdAt: Date.now() }); saveReaderData(); showToast('Note saved locally'); refreshPageAnnotations(); }
function toggleHighlight() { if (highlights.has(currentPage)) { highlights.delete(currentPage); showToast('Highlight removed'); } else { highlights.add(currentPage); showToast('Page highlighted'); } saveReaderData(); refreshPageAnnotations(); updateReaderButtons(); }
function updateReaderButtons() { $('#bookmarkBtn')?.classList.toggle('active', bookmarks.some(item => item.page === currentPage)); $('#highlightBtn')?.classList.toggle('active', highlights.has(currentPage)); }
function revokeUrl(url) { if (url) URL.revokeObjectURL(url); }
function setOutput(input, output) { output.textContent = `${Math.round(Number(input.value) * 100)}%`; }
function openSettings() { els.settingsPanel.classList.add('open'); els.settingsOverlay.classList.add('open'); }
function closeSettings() { els.settingsPanel.classList.remove('open'); els.settingsOverlay.classList.remove('open'); }

async function renderPage(pageNumber, scale = 1.35) { const page = await pdf.getPage(pageNumber); const viewport = page.getViewport({ scale }); const canvas = document.createElement('canvas'); canvas.width = viewport.width; canvas.height = viewport.height; await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise; return { canvas, text: (await page.getTextContent()).items.map(item => item.str).join(' ') }; }
function buildThumbnails() { els.thumbnails.innerHTML = ''; pageData.forEach((item, index) => { const button = document.createElement('button'); button.className = 'thumbnail'; const img = document.createElement('canvas'); img.width = 95; img.height = 130; const ctx = img.getContext('2d'); const source = item.canvas; const ratio = Math.min(img.width / source.width, img.height / source.height); const w = source.width * ratio; const h = source.height * ratio; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, img.width, img.height); ctx.drawImage(source, (img.width - w) / 2, (img.height - h) / 2, w, h); const label = document.createElement('span'); label.textContent = index + 1; button.append(img, label); button.onclick = () => book?.turnToPage(index); els.thumbnails.appendChild(button); }); }
function updatePage(index = 0) { currentPage = index; els.pageInput.value = Math.min(index + 1, pageData.length || 1); document.querySelectorAll('.thumbnail').forEach((t, i) => t.classList.toggle('active', i === index || i === index - 1)); updateReaderButtons(); refreshPageAnnotations(); }
function applyZoom() { zoom = Math.max(0.7, Math.min(1.35, Number(zoom) || 1)); els.zoomLabel.textContent = `${Math.round(zoom * 100)}%`; els.flipbook.style.setProperty('--book-zoom', zoom); els.flipbook.style.transform = zoom === 1 ? 'none' : `scale(${zoom})`; els.flipbook.classList.toggle('is-zoomed', zoom !== 1); }
function getBookFrame() {
  const rect = els.bookStage.getBoundingClientRect();
  const fullscreen = document.fullscreenElement === els.viewerArea;
  const inset = fullscreen ? 42 : 24;
  const availableWidth = Math.max(220, rect.width - inset);
  const availableHeight = Math.max(300, rect.height - inset);
  const maxHeight = fullscreen ? 980 : 680;
  const maxPageWidth = fullscreen ? 700 : 520;
  const compact = window.innerWidth < 768 || rect.width < 768 || availableWidth < availableHeight * 1.08;
  const height = Math.min(maxHeight, availableHeight);
  const aspectWidth = height * (480 / 680);
  const pageWidth = Math.min(maxPageWidth, compact ? availableWidth : (availableWidth / 2) * 0.98, aspectWidth);
  return { pageWidth: Math.max(180, pageWidth), height, bookWidth: compact ? pageWidth : pageWidth * 2, compact };
}
function getBookOrientation() { return getBookFrame().compact ? 'portrait' : 'landscape'; }
function resizeBookFrame() {
  if (!book || resizeFramePending) return;
  resizeFramePending = true;
  requestAnimationFrame(() => {
    resizeFramePending = false;
    const frame = getBookFrame();
    els.flipbook.style.width = `${frame.bookWidth}px`;
    els.flipbook.style.height = `${frame.height}px`;
    const orientation = getBookOrientation();
    if (orientation !== currentOrientation) { currentOrientation = orientation; book.updateOrientation(orientation); }
    else book.update();
    els.bookStage.classList.toggle('single-page-mode', frame.compact);
  });
}
function observeBookStage() {
  frameObserver?.disconnect();
  frameObserver = new ResizeObserver(resizeBookFrame);
  frameObserver.observe(els.bookStage);
}

function playFallbackFlip() { try { const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return; const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sine'; osc.frequency.setValueAtTime(170, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(82, ctx.currentTime + 0.075); gain.gain.setValueAtTime(0.0001, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.09 * Number($('#flipVolume').value), ctx.currentTime + 0.008); gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09); osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.1); } catch { /* audio is optional */ } }
function playFlipSound() { if (!$('#flipSoundToggle').checked) return; if (flipSoundUrl) { const audio = new Audio(flipSoundUrl); audio.volume = Number($('#flipVolume').value); audio.play().catch(() => {}); } else playFallbackFlip(); }

async function openPdf(source, name = 'Untitled document') { setLoading(true); resetBook(); els.emptyState.classList.add('hidden'); els.controls.classList.add('visible'); els.docName.textContent = name.length > 24 ? `${name.slice(0, 22)}…` : name; els.statusText.textContent = 'Rendering pages…'; try { pdf = await pdfjsLib.getDocument(source).promise; els.totalPages.textContent = pdf.numPages; document.querySelector('#thumbCountTab').textContent = pdf.numPages; els.pageInput.max = pdf.numPages; for (let i = 1; i <= pdf.numPages; i++) { els.loadingText.textContent = `Rendering page ${i} of ${pdf.numPages}…`; pageData.push(await renderPage(i)); } pageData.forEach(({ canvas }) => { const page = document.createElement('div'); page.className = 'page'; page.appendChild(canvas); els.flipbook.appendChild(page); }); const frame = getBookFrame(); els.flipbook.style.width = `${frame.bookWidth}px`; els.flipbook.style.height = `${frame.height}px`; book = new PageFlip(els.flipbook, { width: frame.pageWidth, height: frame.height, size: 'fixed', autoSize: false, showCover: true, drawShadow: true, maxShadowOpacity: 0.42, flippingTime: 720, usePortrait: true, mobileScrollSupport: false }); currentOrientation = getBookOrientation(); observeBookStage(); book.loadFromHTML(els.flipbook.querySelectorAll('.page')); book.on('flip', event => { updatePage(event.data); playFlipSound(); }); buildThumbnails(); loadReaderData(); updatePage(0); refreshPageAnnotations(); applyZoom(); els.statusText.textContent = 'Reading mode'; showToast(`${pdf.numPages} pages ready`); } catch (error) { console.error(error); els.emptyState.classList.remove('hidden'); els.controls.classList.remove('visible'); showToast('Could not open that PDF.'); } finally { setLoading(false); } }

function chooseFile() { els.fileInput.click(); }
$('#openBtn').onclick = chooseFile; $('#emptyOpen').onclick = chooseFile;
els.fileInput.onchange = event => { const file = event.target.files[0]; if (!file) return; revokeUrl(pdfUrl); pdfUrl = URL.createObjectURL(file); openPdf(pdfUrl, file.name.replace(/\.pdf$/i, '')); };
$('#prevBtn').onclick = () => book?.flipPrev(); $('#nextBtn').onclick = () => book?.flipNext();
$('#pageInput').onchange = event => { const value = Math.max(1, Math.min(Number(event.target.value), pageData.length)); event.target.value = value; book?.turnToPage(value - 1); };
$('#zoomIn').onclick = () => { zoom = Math.min(1.35, +(zoom + 0.1).toFixed(2)); applyZoom(); }; $('#zoomOut').onclick = () => { zoom = Math.max(0.7, +(zoom - 0.1).toFixed(2)); applyZoom(); };
els.viewerArea = document.querySelector('.viewer-area'); $('#fullscreenBtn').onclick = () => document.fullscreenElement ? document.exitFullscreen() : els.viewerArea.requestFullscreen();
$('#downloadBtn').onclick = () => { if (!pdfUrl) return showToast('Open a PDF first.'); const a = document.createElement('a'); a.href = pdfUrl; a.download = els.docName.textContent + '.pdf'; a.click(); };
$('#printBtn').onclick = () => { if (!pdfUrl) return showToast('Open a PDF first.'); const w = window.open(pdfUrl, '_blank'); w?.addEventListener('load', () => w.print()); };
$('#themeBtn').onclick = () => document.body.classList.toggle('light');
function setSidebarOpen(open) { els.sidebar.classList.toggle('open', open); els.sidebarBackdrop?.classList.toggle('open', open); }
$('#mobileMenu').onclick = () => setSidebarOpen(!els.sidebar.classList.contains('open')); $('#closeSidebar').onclick = () => setSidebarOpen(false); els.sidebarBackdrop?.addEventListener('click', () => setSidebarOpen(false));
$('#settingsBtn').onclick = openSettings; $('#closeSettings').onclick = closeSettings; els.settingsOverlay.onclick = closeSettings; $('#bookmarkBtn').onclick = toggleBookmark; $('#noteBtn').onclick = addNote; $('#highlightBtn').onclick = toggleHighlight; document.querySelectorAll('.side-tab').forEach(tab => tab.onclick = () => setReaderView(tab.dataset.view));
els.searchInput.oninput = event => { const term = event.target.value.trim().toLowerCase(); document.querySelectorAll('.thumbnail').forEach((thumb, i) => thumb.classList.toggle('match', term && pageData[i].text.toLowerCase().includes(term))); const matches = pageData.filter(p => term && p.text.toLowerCase().includes(term)).length; els.searchCount.textContent = term ? `${matches} page${matches === 1 ? '' : 's'}` : ''; renderSearchResults(term); };

$('#flipSoundInput').onchange = event => { const file = event.target.files[0]; if (!file) return; revokeUrl(flipSoundUrl); flipSoundUrl = URL.createObjectURL(file); $('#flipSoundName').textContent = file.name; showToast('Custom flip sound loaded'); };
$('#flipVolume').oninput = () => setOutput($('#flipVolume'), $('#flipVolumeValue'));
$('#musicInput').onchange = event => { const file = event.target.files[0]; if (!file) return; revokeUrl(musicUrl); musicUrl = URL.createObjectURL(file); music.src = musicUrl; $('#musicName').textContent = file.name; showToast('Background music loaded'); };
$('#musicPlay').onclick = () => { if (!musicUrl) return showToast('Choose a music file first.'); music.loop = $('#musicLoop').checked; music.volume = Number($('#musicVolume').value); music.play().then(() => showToast('Background music playing')).catch(() => showToast('Click again to allow music playback.')); };
$('#musicStop').onclick = () => { music.pause(); music.currentTime = 0; };
$('#musicLoop').onchange = () => { music.loop = $('#musicLoop').checked; }; $('#musicVolume').oninput = () => { music.volume = Number($('#musicVolume').value); setOutput($('#musicVolume'), $('#musicVolumeValue')); };
$('#backgroundInput').onchange = event => { const file = event.target.files[0]; if (!file) return; const url = URL.createObjectURL(file); const old = els.stageBackdrop.dataset.url; revokeUrl(old); els.stageBackdrop.dataset.url = url; els.stageBackdrop.style.backgroundImage = `url("${url}")`; $('#backgroundName').textContent = file.name; els.bookStage.classList.add('has-background'); showToast('Preview background applied'); };
$('#overlayRange').oninput = () => { const value = Number($('#overlayRange').value); els.stageBackdrop.style.setProperty('--overlay', value); $('#overlayValue').textContent = `${Math.round(value * 100)}%`; };
$('#resetBackground').onclick = () => { revokeUrl(els.stageBackdrop.dataset.url); els.stageBackdrop.dataset.url = ''; els.stageBackdrop.style.backgroundImage = ''; els.bookStage.classList.remove('has-background'); $('#backgroundName').textContent = 'Upload a background image'; showToast('Default gradient restored'); };

document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeSettings(); zoom = 1; applyZoom(); } if (event.target.matches('input')) return; if (event.key === 'ArrowRight') book?.flipNext(); if (event.key === 'ArrowLeft') book?.flipPrev(); if (event.key === 'f') $('#fullscreenBtn').click(); });
window.addEventListener('resize', resizeBookFrame, { passive: true }); window.addEventListener('orientationchange', () => setTimeout(resizeBookFrame, 120), { passive: true }); document.addEventListener('fullscreenchange', () => { zoom = 1; applyZoom(); setTimeout(resizeBookFrame, 80); });
