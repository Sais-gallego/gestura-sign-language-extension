/**
 * Gestura - Common Vocabulary Signs Dictionary
 * Sequences of multi-joint arm, hand and head keyframes for conversational signs.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SignsCommon = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const commonSigns = {
    'HOLA': {
      word: 'HOLA',
      meaning: 'Saludo / Salutation',
      frames: [
        { armR: { shoulder: -10, elbow: 90, handY: -40, handX: 25 }, head: { nod: 5 }, expression: 'smile', label: 'Mano abierta junto a la sien' },
        { armR: { shoulder: 15, elbow: 80, handY: -35, handX: 45 }, head: { nod: 0 }, expression: 'smile', label: 'Saluda extendiendo la mano hacia afuera' }
      ]
    },
    'GRACIAS': {
      word: 'GRACIAS',
      meaning: 'Gratitud / Thank you',
      frames: [
        { armR: { shoulder: 0, elbow: 100, handY: -15, handX: 0 }, head: { nod: -5 }, expression: 'smile', label: 'Yemas de los dedos tocan la barbilla' },
        { armR: { shoulder: 20, elbow: 45, handY: 10, handX: 10 }, head: { nod: 10 }, expression: 'smile', label: 'La mano se mueve hacia adelante con reverencia' }
      ]
    },
    'POR FAVOR': {
      word: 'POR FAVOR',
      meaning: 'Cortesía / Please',
      frames: [
        { armR: { shoulder: 0, elbow: 80, handY: 5, handX: -10 }, head: { nod: 5 }, expression: 'neutral', label: 'Palma plana sobre el pecho' },
        { armR: { shoulder: 5, elbow: 75, handY: 5, handX: 10 }, head: { nod: 5 }, expression: 'neutral', label: 'Movimiento circular suave sobre el pecho' }
      ]
    },
    'AYUDA': {
      word: 'AYUDA',
      meaning: 'Asistencia / Help',
      frames: [
        { armL: { handY: 20, handX: -10 }, armR: { handY: 15, handX: -10, fist: true }, head: { tilt: 5 }, expression: 'earnest', label: 'Puño derecho apoyado sobre la palma izquierda' },
        { armL: { handY: 5, handX: -10 }, armR: { handY: 0, handX: -10, fist: true }, head: { tilt: 0 }, expression: 'earnest', label: 'Ambas manos se elevan juntas hacia arriba' }
      ]
    },
    'SI': {
      word: 'SI',
      meaning: 'Afirmación / Yes',
      frames: [
        { armR: { elbow: 90, handY: -10, handX: 20, fist: true }, head: { nod: -5 }, expression: 'agree', label: 'Puño cerrado a la altura del hombro' },
        { armR: { elbow: 95, handY: 5, handX: 20, fist: true }, head: { nod: 15 }, expression: 'agree', label: 'El puño asiente hacia abajo simulando la cabeza' }
      ]
    },
    'NO': {
      word: 'NO',
      meaning: 'Negación / No',
      frames: [
        { armR: { elbow: 85, handY: -10, handX: 20, snap: false }, head: { shake: -10 }, expression: 'deny', label: 'Índice, medio y pulgar abiertos' },
        { armR: { elbow: 85, handY: -10, handX: 20, snap: true }, head: { shake: 10 }, expression: 'deny', label: 'Las puntas de los dedos se cierran contra el pulgar' }
      ]
    },
    'AMIGO': {
      word: 'AMIGO',
      meaning: 'Compañero / Friend',
      frames: [
        { armL: { handX: -10, hook: true }, armR: { handX: 10, hook: true }, head: { nod: 5 }, expression: 'smile', label: 'Dedos índices curvados enganchándose' },
        { armL: { handX: 10, hook: true }, armR: { handX: -10, hook: true }, head: { nod: 5 }, expression: 'smile', label: 'Se invierte el enganche fraternalmente' }
      ]
    },
    'BIENVENIDO': {
      word: 'BIENVENIDO',
      meaning: 'Acogida / Welcome',
      frames: [
        { armR: { shoulder: 30, elbow: 60, handX: 40, handY: 10 }, head: { nod: 5 }, expression: 'smile', label: 'Brazo extendido con palma hacia arriba' },
        { armR: { shoulder: 10, elbow: 90, handX: 10, handY: 15 }, head: { nod: 10 }, expression: 'smile', label: 'La mano barre hacia el torso en señal de bienvenida' }
      ]
    }
  };

  return {
    getSign: function (word) {
      if (!word) return null;
      const clean = word.toUpperCase().replace(/[.,!?;:()]/g, '').trim();
      return commonSigns[clean] || null;
    },
    hasSign: function (word) {
      if (!word) return false;
      const clean = word.toUpperCase().replace(/[.,!?;:()]/g, '').trim();
      return !!commonSigns[clean];
    },
    allSigns: function () {
      return Object.keys(commonSigns);
    }
  };
});
