import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export default function VaporText({ text, scrollContainer }) {
  const host = useRef(null);
  const canvas = useRef(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let disposed = false;
    let frame = 0;
    let visible = false;
    let previous = 0;
    let width = 0;
    let height = 0;
    let particles = [];
    let bitmap;
    let resizeObserver;
    let observer;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, inside: false, strength: 0 };
    const ctx = canvas.current.getContext('2d');
    if (!ctx) return;

    const paint = now => {
      frame = 0;
      if (!visible || disposed) return;
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      const follow = 1 - Math.exp(-dt * 17);
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
      pointer.strength += ((pointer.inside ? 1 : 0) - pointer.strength)
        * (1 - Math.exp(-dt * (pointer.inside ? 9 : 6)));
      const spring = pointer.inside ? 13 : 8;
      const decay = Math.exp(-spring * dt);
      const radius = Math.max(35, Math.min(95, width * 0.12));
      let moving = false;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);
      ctx.globalCompositeOperation = 'destination-out';

      for (const p of particles) {
        const dx = p.hx - pointer.x;
        const dy = p.hy - pointer.y;
        const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / radius);
        if (!proximity && !p.distance) continue;
        const force = proximity * proximity * (3 - 2 * proximity) * pointer.strength;
        const wave = Math.sin(now * 0.0024 + p.seed);
        const targetX = p.hx + force * (48 * dx / radius + 24 * wave);
        const targetY = p.hy - force * (75 + 50 * (p.seed % 1) + 10 * wave);
        // Critically damped springs preserve velocity when the cursor leaves or re-enters.
        const offsetX = p.x - targetX, offsetY = p.y - targetY;
        const stepX = (p.vx + spring * offsetX) * dt;
        const stepY = (p.vy + spring * offsetY) * dt;
        p.x = targetX + (offsetX + stepX) * decay;
        p.y = targetY + (offsetY + stepY) * decay;
        p.vx = (p.vx - spring * stepX) * decay;
        p.vy = (p.vy - spring * stepY) * decay;
        p.distance = Math.hypot(p.x - p.hx, p.y - p.hy);
        if (p.distance < 0.12 && Math.abs(p.vx) + Math.abs(p.vy) < 0.8) {
          p.x = p.hx; p.y = p.hy;
          p.vx = p.vy = p.distance = 0;
          continue;
        }
        moving = true;
        // Fade each bit of ink back in as its particle rejoins the letter.
        ctx.globalAlpha = Math.min(1, p.distance / 9);
        ctx.fillRect(p.hx - p.cell / 2, p.hy - p.cell / 2, p.cell + 0.6, p.cell + 0.6);
      }
      ctx.globalCompositeOperation = 'source-over';
      for (const p of particles) {
        if (!p.distance) continue;
        ctx.globalAlpha = Math.min(1, p.distance / 9) * Math.max(0, 1 - p.distance / 180) * p.alpha;
        ctx.fillStyle = p.tint ? '#bcb0f8' : '#f7f5ff';
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      if (pointer.inside || moving || pointer.strength > 0.001) {
        frame = requestAnimationFrame(paint);
      }
    };

    const prepare = () => {
      if (disposed) return;
      width = host.current.clientWidth;
      height = host.current.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.current.width = Math.round(width * dpr);
      canvas.current.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bitmap = document.createElement('canvas');
      bitmap.width = Math.round(width * dpr);
      bitmap.height = Math.round(height * dpr);
      const ink = bitmap.getContext('2d', { willReadFrequently: true });
      ink.scale(dpr, dpr);
      let fontSize = Math.min(160, width * 0.15, height * 0.58);
      ink.font = `900 ${fontSize}px Montserrat`;
      fontSize *= 0.81 * Math.min(1, width * 0.94 / ink.measureText(text).width);
      ink.font = `900 ${fontSize}px Montserrat`;
      ink.textAlign = 'left';
      ink.fillStyle = '#f7f5ff';
      const textLeft = parseFloat(getComputedStyle(host.current).paddingInlineStart) || 0;
      ink.fillText(text, textLeft, height * 0.76);
      const pixels = ink.getImageData(0, 0, bitmap.width, bitmap.height).data;
      const cell = Math.max(1.6, Math.sqrt(width * height / 24000));
      particles = [];
      for (let y = 0; y < height; y += cell) {
        for (let x = 0; x < width; x += cell) {
          const index = (Math.floor(y * dpr) * bitmap.width + Math.floor(x * dpr)) * 4;
          if (pixels[index + 3] < 120) continue;
          const seed = Math.random() * 100;
          particles.push({ hx: x, hy: y, x, y,
            vx: 0, vy: 0, cell, seed, size: 0.6 + Math.random() * 0.8,
            alpha: 0.5 + Math.random() * 0.5, tint: Math.random() < 0.22, distance: 0 });
        }
      }
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);
      setReady(true);
    };

    const move = event => {
      if (event.pointerType === 'touch') return;
      const rect = host.current.getBoundingClientRect();
      pointer.targetX = (event.clientX - rect.left) * width / rect.width;
      pointer.targetY = (event.clientY - rect.top) * height / rect.height;
      if (!frame) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      }
      pointer.inside = true;
      if (visible && bitmap && !frame) {
        previous = performance.now();
        frame = requestAnimationFrame(paint);
      }
    };
    const leave = () => {
      pointer.inside = false;
    };
    const stopOffscreen = () => {
      pointer.inside = false;
      pointer.strength = 0;
      cancelAnimationFrame(frame);
      frame = 0;
      for (const p of particles) {
        p.x = p.hx;
        p.y = p.hy;
        p.vx = p.vy = p.distance = 0;
      }
      if (bitmap) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(bitmap, 0, 0, width, height);
      }
    };
    const element = host.current;
    element.addEventListener('pointerenter', move, { passive: true });
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointercancel', leave);

    document.fonts.load('900 144px Montserrat').then(() => {
      if (disposed) return;
      prepare();
      resizeObserver = new ResizeObserver(prepare);
      resizeObserver.observe(element);
      observer = new IntersectionObserver(entries => {
        const inView = entries[0].isIntersecting;
        if (inView === visible) return;
        visible = inView;
        if (!visible) stopOffscreen();
      }, { root: scrollContainer.current, threshold: 0.2 });
      observer.observe(element);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      observer?.disconnect();
      element.removeEventListener('pointerenter', move);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('pointercancel', leave);
    };
  }, [text, reduced, scrollContainer]);

  return (
    <h2 ref={host} className="vapor-text projects-heading" aria-label={text} tabIndex={-1} data-ready={ready && !reduced}>
      <span className="vapor-text-fallback" aria-hidden="true">{text}</span>
      <canvas ref={canvas} aria-hidden="true" />
    </h2>
  );
}
