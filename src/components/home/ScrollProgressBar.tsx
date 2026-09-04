import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 origin-left z-[110] shadow-[0_0_12px_#10b981] pointer-events-none"
      style={{ scaleX }}
    />
  );
};
