/**
 * Gestura Content Script
 * Injects floating sign language avatar widget, handles text selection & drag-and-drop.
 */

(function () {
  'use strict';

  // Prevent duplicate injection
  if (document.getElementById('gestura-avatar-container')) return;

  let avatarEngine = null;
  let isMinimized = false;
  let selectionPill = null;
  let lastSelectedText = '';

  // 1. Create Floating Widget DOM
  const container = document.createElement('div');
  container.id = 'gestura-avatar-container';
  container.innerHTML = `
    <div class="gestura-header" id="gestura-drag-header">
      <div class="gestura-title">
        <span>🤟</span>
        <span>Gestura Avatar</span>
      </div>
      <div class="gestura-controls">
        <button class="gestura-btn-icon" id="gestura-btn-min" title="Minimizar">_</button>
        <button class="gestura-btn-icon" id="gestura-btn-close" title="Cerrar">✕</button>
      </div>
    </div>
    <canvas id="gestura-canvas" width="280" height="240"></canvas>
    <div class="gestura-body">
      <div class="gestura-input-row">
        <input type="text" class="gestura-input" id="gestura-text-input" placeholder="Escriba texto para señas..." />
        <button class="gestura-btn-send" id="gestura-btn-send">Traducir</button>
      </div>
      <div class="gestura-actions-row">
        <div>
          <label>Velocidad:</label>
          <select class="gestura-select-speed" id="gestura-speed-select">
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1.0" selected>1.0x</option>
            <option value="1.5">1.5x</option>
            <option value="2.0">2.0x</option>
          </select>
        </div>
        <button class="gestura-btn-icon" id="gestura-btn-replay" title="Repetir última traducción">🔄 Repetir</button>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // 2. Initialize Avatar Engine on canvas
  const canvas = document.getElementById('gestura-canvas');
  if (typeof GesturaAvatarEngine !== 'undefined') {
    avatarEngine = new GesturaAvatarEngine(canvas);
  }

  // 3. Drag and Drop functionality
  const header = document.getElementById('gestura-drag-header');
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - container.getBoundingClientRect().left;
    dragOffsetY = e.clientY - container.getBoundingClientRect().top;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = Math.max(10, Math.min(window.innerWidth - container.offsetWidth - 10, e.clientX - dragOffsetX));
    const y = Math.max(10, Math.min(window.innerHeight - container.offsetHeight - 10, e.clientY - dragOffsetY));
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.right = 'auto';
    container.style.bottom = 'auto';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // 4. Minimize / Expand
  const btnMin = document.getElementById('gestura-btn-min');
  btnMin.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMinimize();
  });

  container.addEventListener('click', () => {
    if (isMinimized) {
      toggleMinimize();
    }
  });

  function toggleMinimize() {
    isMinimized = !isMinimized;
    container.classList.toggle('gestura-minimized', isMinimized);
    if (!isMinimized && avatarEngine) {
      avatarEngine.render();
    }
  }

  // 5. Close Button
  document.getElementById('gestura-btn-close').addEventListener('click', (e) => {
    e.stopPropagation();
    container.style.display = 'none';
  });

  // 6. Manual Text Translation
  const textInput = document.getElementById('gestura-text-input');
  const btnSend = document.getElementById('gestura-btn-send');
  const btnReplay = document.getElementById('gestura-btn-replay');
  const speedSelect = document.getElementById('gestura-speed-select');

  function translateText(text) {
    if (!text || !avatarEngine) return;
    lastSelectedText = text;
    if (isMinimized) toggleMinimize();
    container.style.display = 'block';
    avatarEngine.enqueueText(text);
  }

  btnSend.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text) {
      translateText(text);
      textInput.value = '';
    }
  });

  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnSend.click();
    }
  });

  btnReplay.addEventListener('click', () => {
    if (lastSelectedText) {
      translateText(lastSelectedText);
    }
  });

  speedSelect.addEventListener('change', (e) => {
    if (avatarEngine) {
      avatarEngine.setSpeed(parseFloat(e.target.value));
    }
  });

  // 7. Text Selection Floating Pill
  document.addEventListener('mouseup', (e) => {
    // Ignore clicks inside the avatar container
    if (container.contains(e.target)) return;

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText && selectedText.length > 0 && selectedText.length < 500) {
      showSelectionPill(selectedText, e.pageX, e.pageY);
    } else {
      removeSelectionPill();
    }
  });

  function showSelectionPill(text, x, y) {
    removeSelectionPill();
    selectionPill = document.createElement('div');
    selectionPill.id = 'gestura-selection-pill';
    selectionPill.innerHTML = `<span>🤟 Traducir a señas</span>`;
    selectionPill.style.left = `${Math.min(window.innerWidth - 180, x + 10)}px`;
    selectionPill.style.top = `${y - 40}px`;

    selectionPill.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      translateText(text);
      removeSelectionPill();
    });

    document.body.appendChild(selectionPill);
  }

  function removeSelectionPill() {
    if (selectionPill && selectionPill.parentNode) {
      selectionPill.parentNode.removeChild(selectionPill);
      selectionPill = null;
    }
  }

  // 8. Communication with Background Script
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'translate_selection') {
        translateText(message.text);
        sendResponse({ status: 'ok' });
      } else if (message.action === 'toggle_avatar') {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
        sendResponse({ status: 'ok' });
      }
    });
  }

  // Initial welcome greeting
  setTimeout(() => {
    if (avatarEngine) {
      avatarEngine.enqueueText('HOLA');
    }
  }, 1000);
})();
