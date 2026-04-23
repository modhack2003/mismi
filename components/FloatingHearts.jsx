"use client";
import { motion } from "framer-motion";
import React from "react";


const FloatingHearts = () => {
  const hearts = Array.from({ length: 20 });

  return (
    <div className="floating-hearts-container">
      {hearts.map((_, i) => {
        const size = Math.floor(Math.random() * 16) + 24; // 24px to 40px
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 12 + Math.random() * 4; // 12s to 18s

        return (
          <motion.div
            key={i}
            initial={{ y: "100vh", opacity: 1 }}
            animate={{ y: "-20vh", opacity: 0 }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${left}%`,
              fontSize: `${size}px`,
            }}
            className="floating-heart"
          >
            💜
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingHearts;
