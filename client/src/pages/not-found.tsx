import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-slate-300 mb-8">Page not found</p>
        <Button
          size="lg"
          onClick={() => setLocation("/")}
          data-testid="button-home"
        >
          <Home className="w-4 h-4 mr-2" />
          Return Home
        </Button>
      </div>
    </div>
  );
}
