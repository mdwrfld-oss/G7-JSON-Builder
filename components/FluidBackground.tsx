/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

const FluidBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-black h-full w-full">
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Glowing Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#976cd0]/10 rounded-full blur-[100px] pointer-events-none"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#521c83]/20 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-[40%] right-[20%] w-[30vw] h-[30vw] bg-[#ffd22e]/5 rounded-full blur-[80px] pointer-events-none"
        animate={{
          x: [0, 20, 0],
          y: [0, 40, 0],
          scale: [0.9, 1, 0.9]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/90 pointer-events-none" />
    </div>
  );
};

export default FluidBackground;