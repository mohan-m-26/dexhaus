'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktopPointer, setIsDesktopPointer] = useState(false);

  useEffect(() => {
    // Only enable custom cursor if device has a fine pointer (mouse/trackpad), not touch/coarse
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
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', checkPointer);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // If mobile or touch device, do NOT render any custom cursor
  if (!isDesktopPointer || !isVisible) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3.5 h-3.5 bg-[#C9A45C] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        animate={{
          x: mousePosition.x - 7,
          y: mousePosition.y - 7,
          scale: isHovering ? 2.2 : 1,
          opacity: 1
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.12 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#C9A45C] rounded-full pointer-events-none z-[9998] mix-blend-difference hidden lg:block"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.6 : 1,
          opacity: isHovering ? 0 : 0.6
        }}
        transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.4 }}
      />
    </>
  );
}
