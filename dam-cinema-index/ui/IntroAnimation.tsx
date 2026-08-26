import { motion } from "framer-motion";
import { useEffect } from "react";

const LETTERS = ["W", "ò", "F", "l", "i", "x"];

function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-darkBlue"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex items-center gap-3">
        <motion.img
          src="/favicon-32x32.svg"
          alt=""
          className="h-16 w-16 sm:h-24 sm:w-24"
          initial={{ x: -300, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            rotate: [0, -25, -25, 0],
            y: [0, 8, 8, 0],
          }}
          transition={{
            x: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
            opacity: { duration: 0.5 },
            rotate: {
              duration: 2.8,
              times: [0, 0.18, 0.82, 1],
              delay: 0.7,
              ease: "easeInOut",
            },
            y: {
              duration: 2.8,
              times: [0, 0.18, 0.82, 1],
              delay: 0.7,
              ease: "easeInOut",
            },
          }}
        />

        <div className="flex overflow-visible gap-2">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block text-5xl font-bold text-white sm:text-6xl"
              initial={{ opacity: 0, y: 50, x: -15, rotate: -20, scale: 0.5 }}
              animate={{
                opacity: 1,
                y: 0,
                x: 0,
                rotate: 0,
                scale: 1,
              }}
              transition={{
                delay: 1.2 + i * 0.2,
                duration: 0.6,
                type: "spring",
                stiffness: 180,
                damping: 14,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default IntroAnimation;
