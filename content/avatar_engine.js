/**
 * Gestura - Vector Avatar Kinematic Rendering Engine
 * Renders an articulated character (head, face, torso, arms, 5-finger hands)
 * performing real-time sign language animations.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GesturaAvatarEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  class AvatarEngine {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;
      this.speedMultiplier = options.speed || 1.0;
      
      // Animation queue
      this.queue = [];
      this.currentIndex = -1;
      this.isPlaying = false;
      this.isPaused = false;
      this.currentFrameProgress = 0.0;
      
      // Default pose (neutral rest)
      this.pose = {
        head: { x: 0, y: 0, tilt: 0, nod: 0 },
        eyes: { blink: false, lookX: 0 },
        mouth: { smile: 0.5, open: 0 },
        armR: { shoulderX: 45, shoulderY: 70, elbowX: 75, elbowY: 110, handX: 70, handY: 150 },
        armL: { shoulderX: -45, shoulderY: 70, elbowX: -75, elbowY: 110, handX: -70, handY: 150 },
        handR: { fingers: [0, 0, 0, 0, 0], angle: 0 },
        handL: { fingers: [0, 0, 0, 0, 0], angle: 0 },
        subtitle: ''
      };
      
      this.targetPose = JSON.parse(JSON.stringify(this.pose));
      this.startPose = JSON.parse(JSON.stringify(this.pose));

      // Internal blink timer
      this.lastBlinkTime = Date.now();
      this.blinkDuration = 150;
      this.nextBlinkInterval = 3000 + Math.random() * 2000;

      // Start render loop
      this.running = true;
      this.render = this.render.bind(this);
      requestAnimationFrame(this.render);
    }

    setSpeed(mult) {
      this.speedMultiplier = Math.max(0.2, Math.min(3.0, mult));
    }

    enqueueText(text) {
      this.queue = [];
      if (!text) return;

      const words = text.trim().split(/\s+/);
      const commonDict = (typeof SignsCommon !== 'undefined') ? SignsCommon : null;
      const alphaDict = (typeof SignsAlphabet !== 'undefined') ? SignsAlphabet : null;

      for (let w = 0; w < words.length; w++) {
        const word = words[w];
        const cleanWord = word.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // 1. Check if whole-word sign exists
        if (commonDict && commonDict.hasSign(cleanWord)) {
          const sign = commonDict.getSign(cleanWord);
          for (let f = 0; f < sign.frames.length; f++) {
            const frame = sign.frames[f];
            this.queue.push({
              type: 'word_frame',
              word: cleanWord,
              label: `${cleanWord} (${f + 1}/${sign.frames.length}): ${frame.label}`,
              duration: 700,
              data: frame
            });
          }
          // Pause after word
          this.queue.push({ type: 'pause', word: ' ', label: '...', duration: 250, data: null });
        } else {
          // 2. Fallback to fingerspelling (dactylology)
          for (let c = 0; c < cleanWord.length; c++) {
            const char = cleanWord[c];
            const pose = alphaDict ? alphaDict.getPose(char) : null;
            this.queue.push({
              type: 'letter',
              word: cleanWord,
              char: char,
              label: `Letra ${char}: ${pose ? pose.desc : ''}`,
              duration: 550,
              data: pose
            });
          }
          // Space between words
          this.queue.push({ type: 'pause', word: ' ', label: ' ', duration: 300, data: null });
        }
      }

      this.currentIndex = 0;
      this.currentFrameProgress = 0;
      this.isPlaying = true;
      this.isPaused = false;
      this._transitionToNext();
    }

    _transitionToNext() {
      if (this.currentIndex >= this.queue.length) {
        this.isPlaying = false;
        this.pose.subtitle = 'Listo (Seleccione texto para traducir)';
        // Reset to neutral rest pose
        this.targetPose = {
          head: { x: 0, y: 0, tilt: 0, nod: 0 },
          eyes: { blink: false, lookX: 0 },
          mouth: { smile: 0.4, open: 0 },
          armR: { shoulderX: 45, shoulderY: 70, elbowX: 75, elbowY: 110, handX: 65, handY: 145 },
          armL: { shoulderX: -45, shoulderY: 70, elbowX: -75, elbowY: 110, handX: -65, handY: 145 },
          handR: { fingers: [0, 0, 0, 0, 0], angle: 0 },
          handL: { fingers: [0, 0, 0, 0, 0], angle: 0 },
          subtitle: 'Listo'
        };
        this.startPose = JSON.parse(JSON.stringify(this.pose));
        this.currentFrameProgress = 0;
        return;
      }

      const item = this.queue[this.currentIndex];
      this.startPose = JSON.parse(JSON.stringify(this.pose));
      this.pose.subtitle = item.label;

      if (item.type === 'letter' && item.data) {
        // Bring right hand up to signing chest level
        this.targetPose = {
          head: { x: 0, y: 0, tilt: 2, nod: 0 },
          eyes: { blink: false, lookX: 0 },
          mouth: { smile: 0.5, open: 0 },
          armR: { shoulderX: 45, shoulderY: 70, elbowX: 85, elbowY: 90, handX: 55, handY: 45 },
          armL: { shoulderX: -45, shoulderY: 70, elbowX: -70, elbowY: 115, handX: -60, handY: 140 },
          handR: { fingers: item.data.fingers || [1, 1, 1, 1, 1], angle: 0 },
          handL: { fingers: [0, 0, 0, 0, 0], angle: 0 },
          subtitle: item.label
        };
      } else if (item.type === 'word_frame' && item.data) {
        const f = item.data;
        const armR_handX = (f.armR && f.armR.handX !== undefined) ? f.armR.handX : 50;
        const armR_handY = (f.armR && f.armR.handY !== undefined) ? f.armR.handY : 40;
        const armL_handX = (f.armL && f.armL.handX !== undefined) ? f.armL.handX : -60;
        const armL_handY = (f.armL && f.armL.handY !== undefined) ? f.armL.handY : 140;

        this.targetPose = {
          head: { x: (f.head && f.head.shake) || 0, y: (f.head && f.head.nod) || 0, tilt: (f.head && f.head.tilt) || 0, nod: (f.head && f.head.nod) || 0 },
          eyes: { blink: false, lookX: 0 },
          mouth: { smile: (f.expression === 'smile' ? 0.8 : 0.4), open: (f.expression === 'agree' ? 0.3 : 0) },
          armR: { shoulderX: 45, shoulderY: 70, elbowX: 75, elbowY: 90, handX: armR_handX, handY: armR_handY },
          armL: { shoulderX: -45, shoulderY: 70, elbowX: -70, elbowY: 100, handX: armL_handX, handY: armL_handY },
          handR: { fingers: [1, 1, 1, 1, 1], angle: 0 },
          handL: { fingers: [1, 1, 1, 1, 1], angle: 0 },
          subtitle: item.label
        };
      }

      this.frameStartTime = Date.now();
      this.frameDuration = (item.duration || 500) / this.speedMultiplier;
    }

    pause() { this.isPaused = true; }
    resume() { this.isPaused = false; this.frameStartTime = Date.now(); }
    stop() {
      this.isPlaying = false;
      this.isPaused = false;
      this.queue = [];
      this.currentIndex = -1;
      this.pose.subtitle = 'En pausa';
    }

    _lerp(a, b, t) { return a + (b - a) * t; }

    _updateKinematics() {
      const now = Date.now();
      
      // Automatic blinking
      if (now - this.lastBlinkTime > this.nextBlinkInterval) {
        this.pose.eyes.blink = true;
        if (now - this.lastBlinkTime > this.nextBlinkInterval + this.blinkDuration) {
          this.pose.eyes.blink = false;
          this.lastBlinkTime = now;
          this.nextBlinkInterval = 2500 + Math.random() * 3000;
        }
      }

      // Pose interpolation
      if (this.isPlaying && !this.isPaused) {
        const elapsed = now - this.frameStartTime;
        let t = Math.min(1.0, elapsed / Math.max(1, this.frameDuration));
        // Smooth sine ease in-out
        const easeT = 0.5 - 0.5 * Math.cos(t * Math.PI);

        // Interpolate joints
        const s = this.startPose;
        const e = this.targetPose;

        this.pose.head.tilt = this._lerp(s.head.tilt, e.head.tilt, easeT);
        this.pose.head.nod = this._lerp(s.head.nod, e.head.nod, easeT);

        this.pose.armR.elbowX = this._lerp(s.armR.elbowX, e.armR.elbowX, easeT);
        this.pose.armR.elbowY = this._lerp(s.armR.elbowY, e.armR.elbowY, easeT);
        this.pose.armR.handX = this._lerp(s.armR.handX, e.armR.handX, easeT);
        this.pose.armR.handY = this._lerp(s.armR.handY, e.armR.handY, easeT);

        this.pose.armL.elbowX = this._lerp(s.armL.elbowX, e.armL.elbowX, easeT);
        this.pose.armL.elbowY = this._lerp(s.armL.elbowY, e.armL.elbowY, easeT);
        this.pose.armL.handX = this._lerp(s.armL.handX, e.armL.handX, easeT);
        this.pose.armL.handY = this._lerp(s.armL.handY, e.armL.handY, easeT);

        for (let i = 0; i < 5; i++) {
          this.pose.handR.fingers[i] = this._lerp(s.handR.fingers[i] || 0, e.handR.fingers[i] || 0, easeT);
          this.pose.handL.fingers[i] = this._lerp(s.handL.fingers[i] || 0, e.handL.fingers[i] || 0, easeT);
        }

        if (t >= 1.0) {
          this.currentIndex++;
          this._transitionToNext();
        }
      }
    }

    render() {
      if (!this.running) return;
      this._updateKinematics();

      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.42;

      // 1. Soft Studio Gradient Background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1e1e24');
      grad.addColorStop(1, '#0e0e12');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 2. Torso (Body & Shirt)
      ctx.save();
      ctx.translate(cx, cy);

      // Torso shape
      ctx.fillStyle = '#2563eb'; // Royal Blue shirt
      ctx.beginPath();
      ctx.moveTo(-50, 70);
      ctx.lineTo(50, 70);
      ctx.lineTo(65, 170);
      ctx.lineTo(-65, 170);
      ctx.closePath();
      ctx.fill();

      // Shirt collar
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Neck
      ctx.fillStyle = '#fbcfe8'; // Skin tone
      ctx.fillRect(-14, 40, 28, 35);

      // 3. Head & Face
      ctx.save();
      ctx.translate(this.pose.head.x, -10 + this.pose.head.nod);
      ctx.rotate((this.pose.head.tilt * Math.PI) / 180);

      // Head oval
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(0, 10, 38, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#374151'; // Dark Slate Hair
      ctx.beginPath();
      ctx.ellipse(0, -18, 42, 28, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      // Sideburns
      ctx.fillRect(-40, -10, 10, 25);
      ctx.fillRect(30, -10, 10, 25);

      // Eyes
      ctx.fillStyle = '#1f2937';
      if (this.pose.eyes.blink) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#1f2937';
        ctx.beginPath();
        ctx.moveTo(-20, 8); ctx.lineTo(-8, 8);
        ctx.moveTo(8, 8); ctx.lineTo(20, 8);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(-14, 8, 4, 0, Math.PI * 2);
        ctx.arc(14, 8, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Eyebrows
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-22, -1); ctx.lineTo(-8, -2);
      ctx.moveTo(8, -2); ctx.lineTo(22, -1);
      ctx.stroke();

      // Nose
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(-2, 18);
      ctx.lineTo(3, 19);
      ctx.stroke();

      // Mouth
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 26, 10, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();

      ctx.restore(); // restore head

      // 4. Arms & Hands
      this._renderArm(ctx, this.pose.armL, this.pose.handL, true);
      this._renderArm(ctx, this.pose.armR, this.pose.handR, false);

      ctx.restore(); // restore center

      // 5. Subtitle & Status Banner
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, h - 38, w, 38);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 13px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.pose.subtitle || 'Gestura Avatar Activo', w / 2, h - 14);

      requestAnimationFrame(this.render);
    }

    _renderArm(ctx, arm, hand, isLeft) {
      ctx.save();
      ctx.strokeStyle = '#fbcfe8';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Upper arm + Forearm
      ctx.beginPath();
      ctx.moveTo(arm.shoulderX, arm.shoulderY);
      ctx.lineTo(arm.elbowX, arm.elbowY);
      ctx.lineTo(arm.handX, arm.handY);
      ctx.stroke();

      // Shirt sleeve
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.moveTo(arm.shoulderX, arm.shoulderY);
      ctx.lineTo(
        arm.shoulderX + (arm.elbowX - arm.shoulderX) * 0.45,
        arm.shoulderY + (arm.elbowY - arm.shoulderY) * 0.45
      );
      ctx.stroke();

      // Hand palm
      ctx.save();
      ctx.translate(arm.handX, arm.handY);
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fingers (thumb, index, middle, ring, pinky)
      const fAngles = isLeft
        ? [0.7, 0.25, 0.0, -0.25, -0.5]
        : [-0.7, -0.25, 0.0, 0.25, 0.5];

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#f472b6';
      ctx.lineCap = 'round';

      for (let i = 0; i < 5; i++) {
        const state = (hand.fingers && hand.fingers[i] !== undefined) ? hand.fingers[i] : 1;
        const len = (i === 0 ? 9 : (i === 2 ? 14 : 12)) * (state > 0 ? 1.0 : 0.4);
        const ang = fAngles[i] + (state === 0 ? (isLeft ? 0.4 : -0.4) : 0);

        const fx = Math.sin(ang) * len;
        const fy = -Math.cos(ang) * len;

        ctx.beginPath();
        ctx.moveTo(Math.sin(ang) * 4, -Math.cos(ang) * 4);
        ctx.lineTo(fx, fy);
        ctx.stroke();
      }

      ctx.restore(); // restore hand
      ctx.restore(); // restore arm
    }

    destroy() {
      this.running = false;
    }
  }

  return AvatarEngine;
});
