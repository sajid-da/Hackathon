import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Send,
  MapPin,
  Phone,
  Navigation,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { EmergencyCategorization, Responder } from "@shared/schema";

export default function Emergency() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input");
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [categorization, setCategorization] =
    useState<EmergencyCategorization | null>(null);
  const [responders, setResponders] = useState<Responder[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");
        setMessage(transcript);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again or type your message",
          variant: "destructive",
        });
      };

      setRecognition(recognitionInstance);
    }
  }, [toast]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Voice not supported",
        description: "Please type your emergency message",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      speak("Voice input stopped");
    } else {
      recognition.start();
      setIsListening(true);
      speak("I'm listening. Please describe your emergency.");
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoadingLocation(false);
          toast({
            title: "Location detected",
            description: "We'll find the nearest responders",
          });
        },
        () => {
          setIsLoadingLocation(false);
          toast({
            title: "Location unavailable",
            description: "Using default location",
            variant: "destructive",
          });
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else {
      setIsLoadingLocation(false);
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please describe your emergency",
        variant: "destructive",
      });
      return;
    }

    if (!userLocation) {
      await getLocation();
    }

    setStep("analyzing");
    speak("Analyzing your emergency. Please hold on.");

    try {
      const response = await fetch("/api/emergency/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Failed to analyze emergency");

      const data = await response.json();
      setCategorization(data);

      const location = userLocation || { lat: 37.7749, lng: -122.4194 };
      const respondersResponse = await fetch(
        `/api/emergency/responders?lat=${location.lat}&lng=${location.lng}&type=${data.category}`
      );

      if (!respondersResponse.ok) throw new Error("Failed to find responders");

      const respondersData = await respondersResponse.json();
      setResponders(respondersData);

      setStep("results");
      speak(
        `I've categorized this as a ${data.category} emergency. I found ${respondersData.length} nearby responders. ${data.suggestedAction}`
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process emergency. Please try again.",
        variant: "destructive",
      });
      setStep("input");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medical":
        return "bg-medical text-medical-foreground";
      case "police":
        return "bg-police text-police-foreground";
      case "mental_health":
        return "bg-mental text-mental-foreground";
      case "disaster":
        return "bg-disaster text-disaster-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-white border-white/20">
              Step {step === "input" ? "1" : step === "analyzing" ? "2" : "3"}{" "}
              of 3
            </Badge>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  How can we help you?
                </h1>
                <p className="text-xl text-slate-300">
                  Speak or type to describe your emergency
                </p>
              </div>

              <Card className="p-8 bg-card/50 backdrop-blur-lg border-card-border">
                <div className="space-y-6">
                  <div className="relative">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your emergency in detail..."
                      className="min-h-[200px] text-lg resize-none bg-background/50"
                      data-testid="input-emergency-message"
                    />
                    {isListening && (
                      <motion.div
                        className="absolute top-4 right-4"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <div className="w-4 h-4 bg-medical rounded-full" />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant={isListening ? "default" : "outline"}
                      size="lg"
                      onClick={toggleListening}
                      className={`flex-1 min-h-12 ${
                        isListening ? "bg-medical hover:bg-medical/90" : ""
                      }`}
                      data-testid="button-voice-toggle"
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-5 h-5 mr-2" />
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 mr-2" />
                          Start Voice Input
                        </>
                      )}
                    </Button>

                    <Button
                      size="lg"
                      onClick={handleSubmit}
                      disabled={!message.trim()}
                      className="flex-1 bg-medical hover:bg-medical/90 min-h-12"
                      data-testid="button-submit-emergency"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Emergency
                    </Button>
                  </div>

                  {!userLocation && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={getLocation}
                      disabled={isLoadingLocation}
                      className="w-full min-h-12"
                      data-testid="button-get-location"
                    >
                      {isLoadingLocation ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Getting Location...
                        </>
                      ) : (
                        <>
                          <MapPin className="w-5 h-5 mr-2" />
                          Enable Location for Faster Response
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center py-24"
            >
              <motion.div
                className="relative w-32 h-32 mx-auto mb-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-medical via-police to-mental opacity-20" />
                <div className="absolute inset-2 rounded-full bg-card" />
                <Loader2 className="absolute inset-0 m-auto w-16 h-16 text-primary" />
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-4">
                Analyzing Emergency
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                AI is categorizing your request and finding nearby responders...
              </p>
              <Progress value={66} className="max-w-md mx-auto" />
            </motion.div>
          )}

          {step === "results" && categorization && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <Card className="p-8 bg-card/50 backdrop-blur-lg border-card-border">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      Emergency Categorized
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {categorization.suggestedAction}
                    </p>
                  </div>
                  <Badge
                    className={`text-base px-4 py-2 ${getCategoryColor(categorization.category)}`}
                    data-testid={`badge-category-${categorization.category}`}
                  >
                    {categorization.category.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-md bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">
                      Severity
                    </p>
                    <p className="text-xl font-semibold capitalize">
                      {categorization.severity}
                    </p>
                  </div>
                  <div className="p-4 rounded-md bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">
                      Responders Found
                    </p>
                    <p className="text-xl font-semibold">{responders.length}</p>
                  </div>
                </div>
              </Card>

              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Nearest Responders
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {responders.map((responder, index) => (
                    <motion.div
                      key={responder.placeId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover-elevate bg-card/50 backdrop-blur-lg border-card-border h-full">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg text-foreground mb-1">
                              {responder.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {responder.address}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Navigation className="w-4 h-4" />
                            <span>{responder.distance.toFixed(1)} km away</span>
                          </div>

                          {responder.phone && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              asChild
                            >
                              <a href={`tel:${responder.phone}`}>
                                <Phone className="w-4 h-4 mr-2" />
                                Call Now
                              </a>
                            </Button>
                          )}

                          <Button
                            variant="default"
                            size="sm"
                            className={`w-full ${getCategoryColor(categorization.category)}`}
                            asChild
                            data-testid={`button-directions-${index}`}
                          >
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${responder.location.lat},${responder.location.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MapPin className="w-4 h-4 mr-2" />
                              Get Directions
                            </a>
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setStep("input");
                    setMessage("");
                    setCategorization(null);
                    setResponders([]);
                  }}
                  data-testid="button-new-emergency"
                >
                  New Emergency
                </Button>
                <Button
                  size="lg"
                  onClick={() => setLocation("/")}
                  data-testid="button-home"
                >
                  Return Home
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
