import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState<"logo" | "fade">("logo");

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setStage("fade");
    }, 3000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "fade" ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative">
        <motion.div
          initial={{ x: -100, opacity: 0, filter: "blur(20px)" }}
          animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 1.5,
            ease: [0.6, 0.05, 0.01, 0.9],
          }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              delay: 0.3,
            }}
          >
            <div className="relative mb-6">
              <motion.div
                className="absolute inset-0 blur-3xl opacity-50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600" />
              </motion.div>

              <svg
                className="relative h-32 w-32 mx-auto"
                viewBox="0 0 128 128"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
                <motion.path
                  d="M64 20 L64 108 M20 64 L108 64"
                  stroke="url(#gradient2)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="12"
                  fill="url(#gradient3)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                />
                <motion.path
                  d="M40 50 Q50 45 64 50 Q78 45 88 50"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                  <radialGradient id="gradient3">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            <motion.h1
              className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              ConnectAid AI
            </motion.h1>

            <motion.p
              className="text-blue-200/80 text-lg font-light tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              Emergency Response Platform
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
