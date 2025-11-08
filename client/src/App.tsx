import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "@/components/SplashScreen";
import Login from "@/pages/login";
import Landing from "@/pages/landing";
import Emergency from "@/pages/emergency";
import Profile from "@/pages/profile";
import Dashboard from "@/pages/dashboard";
import About from "@/pages/about";
import Settings from "@/pages/settings";
import TestMaps from "@/pages/test-maps";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("connectaid_user");
    if (!storedUser) {
      setLocation("/login");
    } else {
      setIsChecking(false);
    }
  }, [setLocation]);

  const storedUser = localStorage.getItem("connectaid_user");
  if (!storedUser || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <ProtectedRoute component={Landing} />} />
      <Route path="/emergency" component={() => <ProtectedRoute component={Emergency} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/about" component={About} />
      <Route path="/settings" component={Settings} />
      <Route path="/test-maps" component={TestMaps} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("connectaid_user");
    const hasSeenSplash = sessionStorage.getItem("connectaid_splash_seen");
    
    if (storedUser && !hasSeenSplash) {
      setShowSplash(true);
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
