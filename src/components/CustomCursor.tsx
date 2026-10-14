'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktopPointer, setIsDesktopPointer] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  useEffect(() => {
    // Only enable on desktop screens with fine pointer (mouse/trackpad), never on mobile/touch
    const checkPointer = () => {
      const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const isLargeScreen = window.innerWidth >= 1024;
      setIsDesktopPointer(hasFinePointer && isLargeScreen);
    };

    checkPointer();
    window.addEventListener('resize', checkPointer);

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicked(true);
      
      // Spawn light, subtle popping / splashing ripple at click coordinates
      const newRipple: ClickRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      setRipples(prev => [...prev.slice(-4), newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 450);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', checkPointer);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Manage body class to hide the default operating system laptop cursor on desktop only
  useEffect(() => {
    if (isDesktopPointer && isVisible) {
      document.body.classList.add('cursor-none');
    } else {
      document.body.classList.remove('cursor-none');
    }
    return () => {
      document.body.classList.remove('cursor-none');
    };
  }, [isDesktopPointer, isVisible]);

  // Completely hidden on mobile view or touch devices
  if (!isDesktopPointer || !isVisible) {
    return null;
  }

  return (
    <>
      {/* 1. Light Click Pop / Splash Effect (subtle expanding ring + 4 micro-droplets) */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <div key={ripple.id} className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
            {/* Primary soft ripple ring */}
            <motion.div
              initial={{ scale: 0.35, opacity: 0.75 }}
              animate={{ scale: 2.3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed',
                left: ripple.x,
                top: ripple.y,
                width: 26,
                height: 26,
                marginLeft: -13,
                marginTop: -13,
                borderRadius: '9999px',
                border: '1.5px solid #D6AA55',
                backgroundColor: 'rgba(214, 170, 85, 0.15)'
              }}
            />

            {/* 4 Light Micro-Droplets / Sparkles radiating outward */}
            {[0, 90, 180, 270].map((angle, i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 0.85, scale: 1 }}
                animate={{
                  x: Math.cos((angle * Math.PI) / 180) * 18,
                  y: Math.sin((angle * Math.PI) / 180) * 18,
                  opacity: 0,
                  scale: 0.3
                }}
                transition={{ duration: 0.38, ease: "easeOut" }}
                style={{
                  position: 'fixed',
                  left: ripple.x,
                  top: ripple.y,
                  width: 3.5,
                  height: 3.5,
                  marginLeft: -1.75,
                  marginTop: -1.75,
                  borderRadius: '9999px',
                  backgroundColor: '#D6AA55'
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>

      {/* 2. Single Unified Crisp Circle Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full hidden lg:block"
        style={{
          width: 22,
          height: 22,
          boxShadow: isHovering 
            ? '0 0 14px rgba(214, 170, 85, 0.45)' 
            : '0 0 8px rgba(214, 170, 85, 0.25)'
        }}
        animate={{
          x: mousePosition.x - 11,
          y: mousePosition.y - 11,
          scale: isClicked ? 0.75 : isHovering ? 1.4 : 1,
          borderColor: isHovering ? '#D6AA55' : '#D6AA55',
          backgroundColor: isHovering 
            ? 'rgba(214, 170, 85, 0.25)' 
            : 'rgba(214, 170, 85, 0.12)',
          borderWidth: isHovering ? '2px' : '1.75px'
        }}
        transition={{
          type: "spring",
          stiffness: 550,
          damping: 28,
          mass: 0.15
        }}
      >
        {/* Subtle center core accent */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#D6AA55] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </>
  );
}
