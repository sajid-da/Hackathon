import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "@/components/SplashScreen";
import Landing from "@/pages/landing";
import Emergency from "@/pages/emergency";
import Profile from "@/pages/profile";
import Dashboard from "@/pages/dashboard";
import About from "@/pages/about";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/emergency" component={Emergency} />
      <Route path="/profile" component={Profile} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/about" component={About} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("connectaid_splash_seen");
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("connectaid_splash_seen", "true");
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <Toaster />
        <div id="main-content">
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
