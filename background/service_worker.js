/**
 * Gestura Background Service Worker (Manifest V3)
 * Registers context menu and dispatches messages to content scripts.
 */

const CONTEXT_MENU_ID = 'gestura-translate-selection';

// 1. Setup Context Menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: '🤟 Traducir a Lenguaje de Señas con Gestura',
    contexts: ['selection']
  });
});

// 2. Handle Context Menu Click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID && info.selectionText && tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'translate_selection',
      text: info.selectionText
    }).catch((err) => {
      console.warn('[Gestura] Tab not ready or injection pending:', err);
    });
  }
});

// 3. Handle Extension Action Click (optional toggle)
chrome.action.onClicked.addListener((tab) => {
  if (tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'toggle_avatar'
    }).catch(() => {});
  }
});
