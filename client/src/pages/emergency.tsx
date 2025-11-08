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
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { EmergencyCategorization, Responder } from "@shared/schema";
import Header from "@/components/Header";
import WaveformAnimation from "@/components/WaveformAnimation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getTranslation, detectLanguageFromText, type LanguageCode } from "@/lib/translations";

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
  const [preSelectedType, setPreSelectedType] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedResponder, setSelectedResponder] = useState<Responder | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode>("en");
  const t = getTranslation(detectedLanguage);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    if (typeParam) {
      setPreSelectedType(typeParam);
      const categoryNames: Record<string, string> = {
        medical: "medical emergency",
        police: "police assistance",
        mental_health: "mental health support",
        disaster: "disaster relief",
        finance: "financial emergency"
      };
      const categoryName = categoryNames[typeParam] || "emergency";
      toast({
        title: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} selected`,
        description: "Describe your situation below",
      });
    }
    
    // Auto-request user location when page loads for accurate responders
    if (!userLocation && "geolocation" in navigator) {
      console.log("[Emergency] Auto-requesting user location for accurate nearby responders...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log(`[Emergency] ✅ Got user location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          toast({
            title: "Location Detected",
            description: "Showing responders near you",
            duration: 2000,
          });
        },
        (error) => {
          console.warn("[Emergency] ⚠️ Geolocation denied/unavailable, will use fallback when needed:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, [toast]);

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
        const errorMsg = getTranslation(detectedLanguage);
        toast({
          title: errorMsg.voiceError,
          description: errorMsg.pleaseType,
          variant: "destructive",
        });
      };

      setRecognition(recognitionInstance);
    }
  }, [toast, detectedLanguage]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: t.voiceNotSupported,
        description: t.pleaseType,
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      speak(t.voiceStopped, detectedLanguage);
    } else {
      recognition.start();
      setIsListening(true);
      speak(t.voiceWelcome, detectedLanguage);
    }
  };

  const speak = (text: string, languageCode: string = "en") => {
    const settings = localStorage.getItem("connectaid_settings");
    const voiceEnabled = settings
      ? JSON.parse(settings).voiceEnabled !== false
      : true;
    const voiceVolume = settings ? JSON.parse(settings).voiceVolume / 100 : 0.8;

    if ("speechSynthesis" in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Indian voice configuration for warm, empathetic tone
      utterance.rate = 0.95; // Slower rate for clarity and empathy
      utterance.pitch = 1.0; // Warm, natural pitch
      utterance.volume = voiceVolume;
      
      const langMap: Record<string, string> = {
        en: "en-IN", // Indian English
        es: "es-ES",
        fr: "fr-FR",
        de: "de-DE",
        zh: "zh-CN",
        ar: "ar-SA",
        hi: "hi-IN", // Hindi (India)
        pt: "pt-BR",
        ja: "ja-JP",
        ko: "ko-KR",
        it: "it-IT",
        ru: "ru-RU",
      };

      utterance.lang = langMap[languageCode] || languageCode || "en-IN";
      
      // Try to select an Indian voice (Neerja, Aditi for English; Sangeeta for Hindi)
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        let selectedVoice: SpeechSynthesisVoice | null = null;
        
        if (languageCode === "en") {
          // Prefer Indian English voices (Neerja, Aditi, or any en-IN voice)
          selectedVoice = voices.find(v => 
            v.name.toLowerCase().includes("neerja") || 
            v.name.toLowerCase().includes("aditi") ||
            v.lang.startsWith("en-IN")
          ) || voices.find(v => v.lang.startsWith("en-IN")) || null;
        } else if (languageCode === "hi") {
          // Prefer Hindi voices (Sangeeta or any hi-IN voice)
          selectedVoice = voices.find(v => 
            v.name.toLowerCase().includes("sangeeta") ||
            v.lang.startsWith("hi-IN")
          ) || voices.find(v => v.lang.startsWith("hi-IN")) || null;
        } else {
          // For other languages, find matching voice
          const targetLang = langMap[languageCode] || languageCode;
          selectedVoice = voices.find(v => v.lang.startsWith(targetLang.split("-")[0])) || null;
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log(`[TTS] Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
        } else {
          console.log(`[TTS] No specific voice found, using default for ${utterance.lang}`);
        }
      }
      
      // Track speaking state for waveform animation
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
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
          const locationMsg = getTranslation(detectedLanguage);
          toast({
            title: locationMsg.locationDetected,
            description: locationMsg.locationSuccess,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoadingLocation(false);
          const locationMsg = getTranslation(detectedLanguage);
          toast({
            title: locationMsg.locationRequired,
            description: locationMsg.locationFallback,
            variant: "destructive",
          });
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsLoadingLocation(false);
      const locationMsg = getTranslation(detectedLanguage);
      toast({
        title: locationMsg.locationNotSupported,
        description: locationMsg.locationNotSupportedDesc,
        variant: "destructive",
      });
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: t.messageRequired,
        description: t.describeEmergency,
        variant: "destructive",
      });
      return;
    }

    const lang = detectLanguageFromText(message);
    setDetectedLanguage(lang);

    if (!userLocation) {
      await getLocation();
    }

    setStep("analyzing");
    const analyzingMsg = getTranslation(lang);
    speak(analyzingMsg.analyzingDescription, lang);

    try {
      const response = await fetch("/api/emergency/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Failed to analyze emergency");

      const data = await response.json();
      setCategorization(data);

      const location = userLocation || { lat: 28.6139, lng: 77.2090 };
      const respondersResponse = await fetch(
        `/api/emergency/responders?lat=${location.lat}&lng=${location.lng}&type=${data.category}`
      );

      if (!respondersResponse.ok) throw new Error("Failed to find responders");

      const respondersData = await respondersResponse.json();
      setResponders(respondersData);

      const storedUser = localStorage.getItem("connectaid_user");
      const userId = storedUser ? JSON.parse(storedUser).id : undefined;

      const alertPayload = {
        userId,
        message,
        category: data.category,
        location,
        responders: respondersData,
      };

      const alertResponse = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertPayload),
      });

      if (alertResponse.ok) {
        const savedAlert = await alertResponse.json();
        const existingAlerts = localStorage.getItem("connectaid_alerts");
        const alerts = existingAlerts ? JSON.parse(existingAlerts) : [];
        localStorage.setItem(
          "connectaid_alerts",
          JSON.stringify([savedAlert, ...alerts])
        );
      } else {
        console.error("Failed to save alert to backend");
        const existingAlerts = localStorage.getItem("connectaid_alerts");
        const alerts = existingAlerts ? JSON.parse(existingAlerts) : [];
        const newAlert = {
          id: crypto.randomUUID(),
          ...alertPayload,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(
          "connectaid_alerts",
          JSON.stringify([newAlert, ...alerts])
        );
      }

      setStep("results");
      
      const langCode = data.detectedLanguage || "en";
      speak(data.suggestedAction, langCode);
      
      setTimeout(() => {
        if (respondersData.length > 0) {
          const priorityMsg = getPriorityMessage(langCode);
          const responderName = respondersData[0].name;
          const distance = respondersData[0].distance?.toFixed(1) || "nearby";
          speak(`Help is very close. ${responderName} is just ${distance} kilometers away. ${priorityMsg}. You can call them now or get directions.`, langCode);
        }
      }, 3000);
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
      case "finance":
        return "bg-amber-600 text-white";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getPriorityMessage = (lang: string = "en") => {
    const messages: Record<string, string> = {
      en: "PRIORITY: Closest responder - immediate attention",
      es: "PRIORIDAD: Respondedor más cercano - atención inmediata",
      fr: "PRIORITÉ: Répondeur le plus proche - attention immédiate",
      de: "PRIORITÄT: Nächster Retter - sofortige Aufmerksamkeit",
      zh: "优先：最近的响应者 - 立即关注",
      ar: "أولوية: أقرب مستجيب - اهتمام فوري",
      hi: "प्राथमिकता: निकटतम उत्तरदाता - तत्काल ध्यान",
      pt: "PRIORIDADE: Respondedor mais próximo - atenção imediata",
      ja: "優先: 最寄りのレスポンダー - 即時対応",
      ko: "우선순위: 가장 가까운 응답자 - 즉각 대응",
      it: "PRIORITÀ: Risponditore più vicino - attenzione immediata",
      ru: "ПРИОРИТЕТ: Ближайший специалист - немедленное внимание"
    };
    return messages[lang] || messages.en;
  };

  const handleCallClick = (responder: Responder) => {
    setSelectedResponder(responder);
    setCallDialogOpen(true);
  };

  const handleCallConfirm = () => {
    if (selectedResponder?.phone) {
      window.location.href = `tel:${selectedResponder.phone}`;
    }
    setCallDialogOpen(false);
    setSelectedResponder(null);
  };

  const getAnimatedBackground = () => {
    if (!categorization || step === "input") {
      return "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950";
    }
    
    switch (categorization.category) {
      case "medical":
        return "bg-gradient-to-br from-red-950/90 via-slate-900 to-slate-950 animate-pulse-slow";
      case "police":
        return "bg-gradient-to-br from-blue-950/90 via-slate-900 to-slate-950 animate-glow-blue";
      case "mental_health":
        return "bg-gradient-to-br from-teal-950/90 via-slate-900 to-slate-950 animate-glow-teal";
      case "disaster":
        return "bg-gradient-to-br from-orange-950/90 via-slate-900 to-slate-950 animate-wave-orange";
      case "finance":
        return "bg-gradient-to-br from-amber-950/90 via-slate-900 to-slate-950 animate-glow-amber";
      default:
        return "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950";
    }
  };

  return (
    <>
      <Header />
      <div className={`min-h-screen ${getAnimatedBackground()} pt-16 transition-colors duration-1000`}>
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
                  {t.emergencyTitle}
                </h1>
                <p className="text-xl text-slate-300">
                  {t.describeEmergency}
                </p>
              </div>

              <Card className="p-6 mb-8 bg-red-950/50 backdrop-blur-lg border-red-800/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-300 mb-2">
                      {t.governmentWarning}
                    </h3>
                    <p className="text-sm text-red-200/80 leading-relaxed">
                      {t.warningText}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-card/50 backdrop-blur-lg border-card-border">
                <div className="space-y-6">
                  <div className="relative">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.placeholderText}
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
                          {t.stopRecording}
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 mr-2" />
                          {t.voiceButton}
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
                      {t.submitButton}
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
                          {t.gettingLocation}
                        </>
                      ) : (
                        <>
                          <MapPin className="w-5 h-5 mr-2" />
                          {t.enableLocation}
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
                {t.analyzing}
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                {t.findingHelp}
              </p>
              
              {isSpeaking && (
                <div className="mb-6 flex flex-col items-center gap-3">
                  <p className="text-sm text-slate-400">AI Speaking</p>
                  <WaveformAnimation isAnimating={true} bars={7} barColor="#ef4444" />
                </div>
              )}
              
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
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      {t.guidanceTitle}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-4">
                      {categorization.suggestedAction}
                    </p>
                    {isSpeaking && (
                      <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3 mt-4">
                        <WaveformAnimation 
                          isAnimating={true} 
                          bars={5} 
                          barColor="hsl(var(--foreground))" 
                        />
                        <span className="text-sm text-muted-foreground">AI providing guidance...</span>
                      </div>
                    )}
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
                  {t.availableResponders}
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {responders.map((responder, index) => (
                    <motion.div
                      key={responder.placeId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`p-6 hover-elevate bg-card/50 backdrop-blur-lg h-full relative ${
                        index === 0 ? 'border-medical border-2 shadow-lg shadow-medical/50' : 'border-card-border'
                      }`}>
                        {index === 0 && (
                          <div className="absolute -top-3 left-4 bg-medical text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-pulse">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            NEAREST RESPONDER
                          </div>
                        )}
                        <div className="space-y-4">
                          {index === 0 && (
                            <Badge className="bg-medical text-medical-foreground mb-2 w-full justify-center">
                              {getPriorityMessage(categorization.detectedLanguage || "en")}
                            </Badge>
                          )}
                          <div>
                            <h4 className="font-semibold text-lg text-foreground mb-1">
                              {responder.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {responder.address}
                            </p>
                            {responder.hours && (
                              <p className="text-xs text-muted-foreground">
                                {responder.hours}
                              </p>
                            )}
                          </div>

                          <div className={`flex items-center gap-2 text-sm ${
                            index === 0 ? 'text-medical font-semibold' : 'text-muted-foreground'
                          }`}>
                            <Navigation className={`w-4 h-4 ${index === 0 ? 'animate-pulse' : ''}`} />
                            <span>{responder.distance.toFixed(1)} km {t.distance}</span>
                            {index === 0 && (
                              <span className="ml-auto text-xs bg-medical/20 text-medical px-2 py-1 rounded-full">
                                Closest
                              </span>
                            )}
                          </div>

                          {responder.phone && (
                            <Button
                              variant={index === 0 ? "default" : "outline"}
                              size="sm"
                              className={`w-full ${index === 0 ? 'bg-medical hover:bg-medical/90 text-white font-semibold' : ''}`}
                              onClick={() => handleCallClick(responder)}
                              data-testid={`button-call-${index}`}
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              {index === 0 ? `🚨 ${t.callNow}` : t.callNow}
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
                              {t.getDirections}
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

      <AlertDialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <AlertDialogContent data-testid="dialog-call-confirmation">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmCall}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p className="text-base">
                {t.aboutToCall} <strong className="text-foreground">{selectedResponder?.name}</strong>.
              </p>
              <p className="text-sm">
                {t.callDescription}
              </p>
              {selectedResponder && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                  <p><strong>{t.phone}:</strong> {selectedResponder.phone}</p>
                  <p><strong>{t.distance}:</strong> {selectedResponder.distance.toFixed(1)} km</p>
                  {selectedResponder.hours && (
                    <p><strong>{t.hours}:</strong> {selectedResponder.hours}</p>
                  )}
                </div>
              )}
              <p className="text-sm font-medium text-foreground">
                {t.helpOnWay}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-call">
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCallConfirm}
              className="bg-medical hover:bg-medical/90"
              data-testid="button-confirm-call"
            >
              <Phone className="w-4 h-4 mr-2" />
              {t.callNow}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
