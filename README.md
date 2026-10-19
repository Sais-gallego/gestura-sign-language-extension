# 🤟 Gestura - Sign Language Virtual Avatar Extension

[![CI](https://github.com/Sais-gallego/gestura-sign-language-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/Sais-gallego/gestura-sign-language-extension/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Browsers](https://img.shields.io/badge/Browsers-Chrome%20%7C%20Firefox%20%7C%20Edge%20%7C%20Brave-blue.svg)](#-cross-browser-compatibility)

**Gestura** is an open-source cross-browser accessibility web extension featuring an interactive, animated virtual avatar (*"pequeña persona intérprete"*) that translates selected webpage text into sign language in real time.

Designed for universal accessibility, inclusive web navigation, and deaf/hard-of-hearing educational assistance.

---

## 🌟 Key Features

- **Floating Interactive Avatar**: A clean, pleasant character that appears on any webpage with expressive facial animation (blinking, eye contact, mouth expressions) and articulated 5-finger hands.
- **Instant Text-to-Sign Translation**:
  - **Text Selection Pill**: Highlight any sentence or word on any website; a small floating badge (`🤟 Traducir a señas`) appears to translate it instantly.
  - **Context Menu Integration**: Right-click any selected text and choose *"Traducir a Lenguaje de Señas con Gestura"*.
  - **Manual Input Bar**: Type custom text directly inside the avatar widget.
- **Hybrid Sign Dictionary**:
  - **Common Vocabulary Gestures**: Multi-frame full signs for frequent expressions (*HOLA, GRACIAS, POR FAVOR, AYUDA, SI, NO, AMIGO, BIENVENIDO*).
  - **Dactylology (Manual Fingerspelling)**: Complete anatomical alphabet (A–Z) and numerals (0–9) for proper nouns, acronyms, and arbitrary text.
- **Real-Time Kinematics & Subtitle HUD**:
  - Displays real-time subtitles and descriptions explaining each manual pose.
  - Smooth trigonometric sine easing between hand transitions.
- **Customizable Controls**:
  - **Variable Speed**: `0.5x` (learning mode), `0.75x`, `1.0x` (normal), `1.5x`, and `2.0x`.
  - **Draggable & Minimizable**: Drag the widget anywhere across the screen, or collapse it into a discrete floating badge.
  - **Standalone Web Studio**: Includes a full-screen demo page (`demo/demo.html`) accessible even without installing the extension.

---

## 🌐 Cross-Browser Compatibility

| Browser | Platform | Compatibility | Installation Method |
| :--- | :--- | :---: | :--- |
| **Google Chrome** | Windows / macOS / Linux | ✅ 100% | `chrome://extensions` (Developer Mode) |
| **Microsoft Edge** | Windows / macOS | ✅ 100% | `edge://extensions` (Developer Mode) |
| **Mozilla Firefox** | Windows / macOS / Linux | ✅ 100% | `about:debugging` (Load Temporary Add-on) |
| **Brave** | All | ✅ 100% | `brave://extensions` (Developer Mode) |
| **Opera** | All | ✅ 100% | `opera://extensions` (Developer Mode) |

---

## 🚀 How to Install & Run

### Method 1: Load as Unpacked Extension (Chrome / Edge / Brave / Opera)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Sais-gallego/gestura-sign-language-extension.git
   ```
2. Open your browser and navigate to:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **"Load unpacked"** (Cargar descomprimida).
5. Select the `gestura-sign-language-extension` folder.
6. The Gestura icon 🤟 will appear in your browser toolbar!

### Method 2: Load in Mozilla Firefox

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click **"Load Temporary Add-on..."** (Cargar complemento temporal).
3. Select the `manifest.json` file inside the `gestura-sign-language-extension` folder.

### Method 3: Instant Standalone Web Demo (No Installation Required)

Double-click or open `demo/demo.html` in any browser to immediately interact with the virtual interpreter!

---

## 🧪 Testing

Run automated tests validating Manifest V3 compliance, dictionary integrity, and kinematics:

```bash
npm test
```

---

## 📁 Project Architecture

```
gestura-sign-language-extension/
├── manifest.json              # Cross-browser Manifest V3 configuration
├── popup/                     # Browser toolbar action popup
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── content/                   # Webpage injection & avatar renderer
│   ├── avatar_engine.js       # Kinematic joint rendering & animation engine
│   ├── content.js             # Floating UI, drag-and-drop & text listeners
│   └── content.css            # Scoped widget styling
├── background/                # Service worker for context menus
│   └── service_worker.js
├── dictionary/                # Sign language pose datasets
│   ├── signs_alphabet.js      # Complete dactylology fingerspelling (A-Z, 0-9)
│   └── signs_common.js        # Conversational whole-sign gestures
├── demo/                      # Standalone test studio
│   └── demo.html
├── icons/                     # 16x16, 32x32, 48x48, 128x128 icons
├── tests/                     # Automated test suite
└── .github/workflows/ci.yml   # Multi-node GitHub Actions CI
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
