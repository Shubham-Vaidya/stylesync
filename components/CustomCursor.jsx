'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const cursorRef    = useRef(null);
  const dotRef       = useRef(null);
  const labelRef     = useRef(null);
  const isExpanded   = useRef(false);
  const cursorLabel  = useRef('');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot    = dotRef.current;
    if (!cursor || !dot) return;

    // Map targets → labels
    const LABEL_MAP = [
      { selector: '[data-cursor="drag"]',  label: 'DRAG' },
      { selector: '[data-cursor="drop"]',  label: 'DROP' },
      { selector: '[data-cursor="try"]',   label: 'TRY'  },
      { selector: '[data-cursor="view"]',  label: 'VIEW' },
      { selector: 'a, button, [role="button"], label, select', label: '' },
    ];

    function onMove(e) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }

    function onEnter(e) {
      const target = e.target;
      let matched  = false;
      for (const { selector, label } of LABEL_MAP) {
        if (target.closest(selector)) {
          expandCursor(label);
          matched = true;
          break;
        }
      }
      if (!matched) collapseCursor();
    }

    function onLeave() {
      collapseCursor();
    }

    function onDown() {
      cursor.style.transform = `translate(-50%, -50%) scale(0.7)`;
    }

    function onUp() {
      cursor.style.transform = `translate(-50%, -50%) scale(1)`;
    }

    function expandCursor(label) {
      isExpanded.current = true;
      cursorLabel.current = label;
      cursor.style.width  = '38px';
      cursor.style.height = '38px';
      cursor.style.background = 'transparent';
      cursor.style.border = '1px solid #C8A96E';
      dot.style.opacity = '0';
      if (labelRef.current) {
        labelRef.current.textContent = label;
        labelRef.current.style.opacity = label ? '1' : '0';
      }
    }

    function collapseCursor() {
      isExpanded.current = false;
      cursor.style.width  = '8px';
      cursor.style.height = '8px';
      cursor.style.background = '#C8A96E';
      cursor.style.border = 'none';
      dot.style.opacity = '1';
      if (labelRef.current) {
        labelRef.current.style.opacity = '0';
      }
    }

    window.addEventListener('mousemove',   onMove, { passive: true });
    window.addEventListener('mouseover',   onEnter);
    window.addEventListener('mouseout',    onLeave);
    window.addEventListener('mousedown',   onDown);
    window.addEventListener('mouseup',     onUp);

    return () => {
      window.removeEventListener('mousemove',   onMove);
      window.removeEventListener('mouseover',   onEnter);
      window.removeEventListener('mouseout',    onLeave);
      window.removeEventListener('mousedown',   onDown);
      window.removeEventListener('mouseup',     onUp);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className="pointer-events-none fixed top-0 left-0 z-[99999]"
    >
      {/* Inner dot / expanded ring */}
      <div
        ref={cursorRef}
        style={{
          width: '8px',
          height: '8px',
          background: '#C8A96E',
          borderRadius: '50%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease, border 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div ref={dotRef} style={{ width: '100%', height: '100%', borderRadius: '50%', transition: 'opacity 0.2s' }} />
        <span
          ref={labelRef}
          style={{
            position: 'absolute',
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.38rem',
            letterSpacing: '0.12em',
            color: '#C8A96E',
            textTransform: 'uppercase',
            opacity: 0,
            transition: 'opacity 0.2s',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        />
      </div>
    </motion.div>
  );
}
