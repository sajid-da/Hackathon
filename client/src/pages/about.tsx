import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Heart, Shield, Globe, Zap, Users, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Response",
      description: "Google Gemini AI categorizes emergencies instantly and provides intelligent assistance in real-time."
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Our AI understands and responds in your language automatically, breaking down communication barriers."
    },
    {
      icon: Phone,
      title: "Voice-First Design",
      description: "Hands-free voice input and audio feedback for accessibility during emergencies."
    },
    {
      icon: Shield,
      title: "Ethical & Secure",
      description: "Your safety and privacy are our top priorities. All data is handled with care and respect."
    },
    {
      icon: Users,
      title: "Inclusive Access",
      description: "Designed for everyone, including people with disabilities. High contrast, screen reader support, and keyboard navigation."
    },
    {
      icon: Heart,
      title: "Always Available",
      description: "24/7 emergency assistance with real-time responder location and guidance."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              About ConnectAid AI
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              A next-generation emergency response platform that connects people in distress with real responders using AI, voice technology, and intelligent mapping.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  ConnectAid AI was built with a single purpose: to save lives by making emergency response faster, smarter, and more accessible to everyone.
                </p>
                <p>
                  We believe that in moments of crisis, every second counts. Our platform uses cutting-edge AI technology to understand your emergency, communicate in your language, and connect you with the right help immediately.
                </p>
                <p>
                  We're committed to ethical AI practices, ensuring our technology serves humanity with respect, privacy, and compassion.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card className="h-full hover-elevate">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-12 text-center"
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  ConnectAid AI is powered by Google Gemini AI, Google Maps, and modern web technologies to deliver reliable, instant emergency assistance.
                </p>
                <p className="text-sm text-muted-foreground/80">
                  Version 1.0 | Built with care for humanity
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
