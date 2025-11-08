import { motion } from "framer-motion";

interface WaveformAnimationProps {
  isAnimating?: boolean;
  bars?: number;
  barColor?: string;
}

export default function WaveformAnimation({ 
  isAnimating = false, 
  bars = 5,
  barColor = "currentColor"
}: WaveformAnimationProps) {
  // Generate random heights for a more dynamic waveform
  const barHeights = Array.from({ length: bars }, (_, i) => ({
    initial: 8 + (i % 3) * 4,
    animate: [8, 24, 12, 28, 8],
  }));

  return (
    <div className="flex items-center justify-center gap-1 h-8" data-testid="waveform-animation">
      {barHeights.map((bar, index) => (
        <motion.div
          key={index}
          className="w-1 rounded-full"
          style={{
            backgroundColor: barColor,
            height: isAnimating ? undefined : `${bar.initial}px`,
          }}
          animate={
            isAnimating
              ? {
                  height: bar.animate.map((h) => `${h}px`),
                }
              : { height: `${bar.initial}px` }
          }
          transition={{
            duration: 0.8,
            repeat: isAnimating ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
}
