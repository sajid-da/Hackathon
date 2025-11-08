import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Moon, Sun, Volume2, VolumeX, Languages, Accessibility } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState([80]);
  const [preferredLanguage, setPreferredLanguage] = useState("auto");
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const settings = localStorage.getItem("connectaid_settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      setDarkMode(parsed.darkMode || false);
      setVoiceEnabled(parsed.voiceEnabled !== false);
      setVoiceVolume([parsed.voiceVolume || 80]);
      setPreferredLanguage(parsed.preferredLanguage || "auto");
      setHighContrast(parsed.highContrast || false);
      setReduceMotion(parsed.reduceMotion || false);

      if (parsed.darkMode) {
        document.documentElement.classList.add("dark");
      }
      if (parsed.highContrast) {
        document.documentElement.classList.add("high-contrast");
      }
      if (parsed.reduceMotion) {
        document.documentElement.classList.add("reduce-motion");
      }
    }
  }, []);

  const saveSettings = (updates: any) => {
    const currentSettings = {
      darkMode,
      voiceEnabled,
      voiceVolume: voiceVolume[0],
      preferredLanguage,
      highContrast,
      reduceMotion,
      ...updates,
    };

    localStorage.setItem("connectaid_settings", JSON.stringify(currentSettings));
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    saveSettings({ darkMode: checked });
  };

  const handleVoiceToggle = (checked: boolean) => {
    setVoiceEnabled(checked);
    saveSettings({ voiceEnabled: checked });
  };

  const handleVolumeChange = (value: number[]) => {
    setVoiceVolume(value);
    saveSettings({ voiceVolume: value[0] });
  };

  const handleLanguageChange = (value: string) => {
    setPreferredLanguage(value);
    saveSettings({ preferredLanguage: value });
  };

  const handleHighContrastToggle = (checked: boolean) => {
    setHighContrast(checked);
    if (checked) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    saveSettings({ highContrast: checked });
  };

  const handleReduceMotionToggle = (checked: boolean) => {
    setReduceMotion(checked);
    if (checked) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
    saveSettings({ reduceMotion: checked });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Customize your ConnectAid AI experience
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how ConnectAid AI looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme for better visibility in low light
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                    data-testid="switch-dark-mode"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="high-contrast">High Contrast</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better readability
                    </p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={highContrast}
                    onCheckedChange={handleHighContrastToggle}
                    data-testid="switch-high-contrast"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Voice Assistance
                </CardTitle>
                <CardDescription>
                  Configure voice input and output settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="voice-enabled">Voice Feedback</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable AI voice responses during emergencies
                    </p>
                  </div>
                  <Switch
                    id="voice-enabled"
                    checked={voiceEnabled}
                    onCheckedChange={handleVoiceToggle}
                    data-testid="switch-voice-enabled"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-volume">Voice Volume</Label>
                    <span className="text-sm text-muted-foreground">{voiceVolume[0]}%</span>
                  </div>
                  <Slider
                    id="voice-volume"
                    value={voiceVolume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={5}
                    disabled={!voiceEnabled}
                    data-testid="slider-voice-volume"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Language
                </CardTitle>
                <CardDescription>
                  AI will detect and respond in your language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={preferredLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger id="language" data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    When set to auto-detect, AI will understand and respond in whatever language you use
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="h-5 w-5" />
                  Accessibility
                </CardTitle>
                <CardDescription>
                  Make ConnectAid AI work better for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="reduce-motion">Reduce Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch
                    id="reduce-motion"
                    checked={reduceMotion}
                    onCheckedChange={handleReduceMotionToggle}
                    data-testid="switch-reduce-motion"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
