import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Brain, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";

export default function Landing() {
  const [, setLocation] = useLocation();

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 15,
  }));

  return (
    <>
      <Header />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-red-900/20 to-amber-900/30 animate-gradient-shift bg-300"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(127, 29, 29, 0.2) 50%, rgba(120, 53, 15, 0.3) 100%)",
        }}
      />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
          }}
          animate={{
            x: [`${particle.x}vw`, `${(particle.x + 10) % 100}vw`],
            y: [
              `${particle.y}vh`,
              `${(particle.y + 20) % 100}vh`,
              `${particle.y}vh`,
            ],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl"
        >
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ConnectAid{" "}
            <span className="bg-gradient-to-r from-red-400 via-amber-400 to-blue-400 bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Next-generation emergency response powered by AI. Real-time help
            with voice-first accessibility and instant responder connections.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              size="lg"
              onClick={() => setLocation("/emergency")}
              className="px-16 py-8 text-xl font-semibold uppercase tracking-wide bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-2xl animate-pulse-glow min-h-16"
              style={{
                boxShadow: "0 0 60px rgba(220, 38, 38, 0.6)",
              }}
              data-testid="button-get-help"
            >
              Get Help Now
            </Button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover-elevate">
              <div className="w-16 h-16 rounded-full bg-medical/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-medical" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">Medical</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Instant hospital connection
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover-elevate">
              <div className="w-16 h-16 rounded-full bg-police/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-police" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">Police</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Security assistance
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover-elevate">
              <div className="w-16 h-16 rounded-full bg-mental/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-mental" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">
                  Mental Health
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Counseling support
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover-elevate">
              <div className="w-16 h-16 rounded-full bg-disaster/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-disaster" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">Disaster</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Emergency services
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-16 flex gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation("/profile")}
              className="backdrop-blur-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
              data-testid="button-profile"
            >
              My Profile
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setLocation("/dashboard")}
              className="backdrop-blur-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
              data-testid="button-dashboard"
            >
              Control Panel
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
