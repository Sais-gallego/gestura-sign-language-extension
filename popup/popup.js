/**
 * Gestura Popup Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('popup-input');
  const btnTranslate = document.getElementById('btn-popup-translate');
  const speedSelect = document.getElementById('popup-speed');
  const chips = document.querySelectorAll('.chip');
  const btnOpenDemo = document.getElementById('btn-open-demo');

  // Send message to active tab
  function sendToActiveTab(text) {
    if (!text) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'translate_selection',
          text: text
        }).catch((err) => {
          console.warn('[Gestura] Tab not ready for translation:', err);
        });
      }
    });
  }

  btnTranslate.addEventListener('click', () => {
    const val = input.value.trim();
    if (val) {
      sendToActiveTab(val);
      input.value = '';
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      btnTranslate.click();
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const word = chip.getAttribute('data-word');
      sendToActiveTab(word);
    });
  });

  btnOpenDemo.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('demo/demo.html') });
  });
});
