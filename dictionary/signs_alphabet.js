/**
 * Gestura - Dactylology Fingerspelling Dictionary (A-Z, 0-9)
 * Represents anatomical joint states and SVG path representations for manual alphabet.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SignsAlphabet = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Base finger configurations: [thumb, index, middle, ring, pinky]
  // 0: curled/closed, 1: extended/straight, 0.5: bent/hooked
  const alphabet = {
    'A': { label: 'A', fingers: [1, 0, 0, 0, 0], palm: 'forward', desc: 'Puño cerrado con el pulgar extendido hacia un lado' },
    'B': { label: 'B', fingers: [0, 1, 1, 1, 1], palm: 'forward', desc: 'Cuatro dedos extendidos juntos, pulgar doblado en la palma' },
    'C': { label: 'C', fingers: [0.5, 0.5, 0.5, 0.5, 0.5], palm: 'inward', desc: 'Mano curvada formando una letra C' },
    'D': { label: 'D', fingers: [0.5, 1, 0, 0, 0], palm: 'forward', desc: 'Índice extendido hacia arriba, los demás tocan el pulgar' },
    'E': { label: 'E', fingers: [0, 0.5, 0.5, 0.5, 0.5], palm: 'forward', desc: 'Dedos doblados hacia adentro tocando la yema del pulgar' },
    'F': { label: 'F', fingers: [0, 0, 1, 1, 1], palm: 'forward', desc: 'Pulgar e índice forman un círculo, otros tres extendidos' },
    'G': { label: 'G', fingers: [1, 1, 0, 0, 0], palm: 'inward', desc: 'Índice y pulgar paralelos apuntando hacia el lado' },
    'H': { label: 'H', fingers: [1, 1, 1, 0, 0], palm: 'inward', desc: 'Índice y medio extendidos horizontalmente juntos' },
    'I': { label: 'I', fingers: [0, 0, 0, 0, 1], palm: 'forward', desc: 'Solo el dedo meñique extendido verticalmente' },
    'J': { label: 'J', fingers: [0, 0, 0, 0, 1], palm: 'forward', motion: 'hook', desc: 'Meñique extendido dibujando una curva en J' },
    'K': { label: 'K', fingers: [1, 1, 1, 0, 0], palm: 'forward', desc: 'Índice y medio en V con el pulgar entre ambos' },
    'L': { label: 'L', fingers: [1, 1, 0, 0, 0], palm: 'forward', desc: 'Índice y pulgar extendidos formando un ángulo recto (L)' },
    'M': { label: 'M', fingers: [0, 0, 0, 0, 0], palm: 'down', desc: 'Tres dedos doblados sobre el pulgar' },
    'N': { label: 'N', fingers: [0, 0, 0, 0, 0], palm: 'down', desc: 'Dos dedos doblados sobre el pulgar' },
    'O': { label: 'O', fingers: [0.5, 0.5, 0.5, 0.5, 0.5], palm: 'forward', desc: 'Todos los dedos se unen con el pulgar formando una O' },
    'P': { label: 'P', fingers: [1, 1, 1, 0, 0], palm: 'down', desc: 'Configuración de K apuntando hacia abajo' },
    'Q': { label: 'Q', fingers: [1, 1, 0, 0, 0], palm: 'down', desc: 'Configuración de G apuntando hacia abajo' },
    'R': { label: 'R', fingers: [0, 1, 1, 0, 0], palm: 'forward', crossed: true, desc: 'Índice y dedo medio cruzados' },
    'S': { label: 'S', fingers: [0, 0, 0, 0, 0], palm: 'forward', desc: 'Puño cerrado con el pulgar cruzando sobre los dedos' },
    'T': { label: 'T', fingers: [0, 0, 0, 0, 0], palm: 'forward', desc: 'Pulgar metido entre el índice y el dedo medio' },
    'U': { label: 'U', fingers: [0, 1, 1, 0, 0], palm: 'forward', desc: 'Índice y dedo medio extendidos juntos rectos' },
    'V': { label: 'V', fingers: [0, 1, 1, 0, 0], palm: 'forward', spread: true, desc: 'Índice y dedo medio extendidos separados (V de victoria)' },
    'W': { label: 'W', fingers: [0, 1, 1, 1, 0], palm: 'forward', spread: true, desc: 'Índice, medio y anular extendidos separados (W)' },
    'X': { label: 'X', fingers: [0, 0.5, 0, 0, 0], palm: 'forward', desc: 'Índice doblado en forma de gancho' },
    'Y': { label: 'Y', fingers: [1, 0, 0, 0, 1], palm: 'forward', desc: 'Pulgar y meñique extendidos (señal de teléfono o shaka)' },
    'Z': { label: 'Z', fingers: [0, 1, 0, 0, 0], palm: 'forward', motion: 'zigzag', desc: 'Dedo índice extendido dibujando una Z en el aire' },
    ' ': { label: 'Espacio', fingers: [0, 0, 0, 0, 0], palm: 'rest', desc: 'Pausa neutra entre palabras' }
  };

  // Digits 0-9
  alphabet['0'] = alphabet['O'];
  alphabet['1'] = alphabet['D'];
  alphabet['2'] = alphabet['V'];
  alphabet['3'] = { label: '3', fingers: [1, 1, 1, 0, 0], palm: 'forward', desc: 'Pulgar, índice y medio extendidos' };
  alphabet['4'] = { label: '4', fingers: [0, 1, 1, 1, 1], palm: 'forward', desc: 'Cuatro dedos extendidos, pulgar doblado' };
  alphabet['5'] = { label: '5', fingers: [1, 1, 1, 1, 1], palm: 'forward', desc: 'Mano abierta con todos los dedos extendidos' };

  return {
    getPose: function (char) {
      if (!char) return alphabet[' '];
      const upper = char.toUpperCase();
      return alphabet[upper] || alphabet['A'];
    },
    allChars: function () {
      return Object.keys(alphabet);
    }
  };
});
