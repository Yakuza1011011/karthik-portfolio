import { Fragment, useCallback, useEffect, useRef } from 'react';
import { useMotionValueEvent, useReducedMotion } from 'motion/react';

const TEXT = 'Wanna Contact?';

// Keep the outline fixed while a single, gentle pulse fades the fill.
const PULSE = [
  { opacity: 0.03, textShadow: '0 0 0 transparent', offset: 0.28 },
  { opacity: 0.14, textShadow: '0 0 0.08em #ae92ff30', offset: 0.44 },
  { opacity: 1, textShadow: '0 0 0.14em #ae92ff60', offset: 0.78 },
  { opacity: 1, textShadow: '0 0 0 transparent', offset: 1 },
];

export default function ContactText({ progress }) {
  const root = useRef(null);
  const animations = useRef(new Map());
  const revealed = useRef(false);
  const reduced = useReducedMotion();

  const animateFill = useCallback((letter, frames, { duration, delay = 0, hold = false }) => {
    if (reduced || !letter) return;
    const fill = letter.querySelector('.contact-letter__fill');
    // Read the visible state before cancelling, including during a quick re-entry.
    const current = getComputedStyle(fill);
    const start = { opacity: current.opacity, textShadow: current.textShadow, offset: 0 };
    animations.current.get(fill)?.cancel();
    const animation = fill.animate([start, ...frames], {
      duration,
      delay,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both',
    });
    animations.current.set(fill, animation);
    animation.onfinish = () => {
      if (!hold && animations.current.get(fill) === animation) {
        // The final white fill matches the base style, so removing it is invisible.
        animation.cancel();
        animations.current.delete(fill);
      }
    };
  }, [reduced]);

  const pulse = useCallback((letter, delay = 0) => {
    animateFill(letter, PULSE, { duration: 1800, delay });
  }, [animateFill]);

  const outline = useCallback(letter => {
    animateFill(letter, [{ opacity: 0.03, textShadow: '0 0 0 transparent', offset: 1 }], {
      duration: 650,
      hold: true,
    });
  }, [animateFill]);

  const restore = useCallback(letter => {
    animateFill(letter, [
      { opacity: 1, textShadow: '0 0 0.12em #ae92ff50', offset: 0.8 },
      { opacity: 1, textShadow: '0 0 0 transparent', offset: 1 },
    ], { duration: 1400 });
  }, [animateFill]);

  const reveal = useCallback(value => {
    if (value < 0.25) revealed.current = false;
    if (value < 0.88 || revealed.current) return;
    revealed.current = true;
    root.current?.querySelectorAll('.contact-letter').forEach((letter, index) => {
      pulse(letter, ((index * 7) % 13) * 35);
    });
  }, [pulse]);

  useMotionValueEvent(progress, 'change', reveal);

  useEffect(() => {
    reveal(progress.get());
    const active = animations.current;
    return () => {
      active.forEach(animation => animation.cancel());
      active.clear();
      revealed.current = false;
    };
  }, [progress, reveal]);

  return (
    <span ref={root} className="contact-text" aria-hidden="true">
      {TEXT.split(' ').map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {wordIndex > 0 && ' '}
          <span className="contact-word">
            {Array.from(word).map((letter, index) => (
              <span key={index} className="contact-letter"
                onPointerEnter={event => {
                  if (event.pointerType !== 'touch') outline(event.currentTarget);
                }}
                onPointerLeave={event => {
                  if (event.pointerType !== 'touch') restore(event.currentTarget);
                }}
                onPointerCancel={event => {
                  restore(event.currentTarget);
                }}
                onPointerDown={event => {
                  if (event.pointerType === 'touch') pulse(event.currentTarget);
                }}>
                <span className="contact-letter__outline">{letter}</span>
                <span className="contact-letter__fill">{letter}</span>
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
