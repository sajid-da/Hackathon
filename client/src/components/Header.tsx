import { Link, useLocation } from "wouter";
import { Menu, Info, Settings, Home, Phone, LayoutDashboard, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="hover-elevate active-elevate-2">
            <div className="flex items-center gap-2" data-testid="link-home">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                ConnectAid AI
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2" aria-label="Main navigation">
            <Button
              variant={location === "/" ? "default" : "ghost"}
              size="sm"
              data-testid="button-nav-home"
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>

            <Button
              variant={location === "/emergency" ? "default" : "ghost"}
              size="sm"
              data-testid="button-nav-emergency"
              asChild
            >
              <Link href="/emergency">
                <Phone className="h-4 w-4 mr-2" />
                Emergency
              </Link>
            </Button>

            <Button
              variant={location === "/profile" ? "default" : "ghost"}
              size="sm"
              data-testid="button-nav-profile"
              asChild
            >
              <Link href="/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>

            <Button
              variant={location === "/dashboard" ? "default" : "ghost"}
              size="sm"
              data-testid="button-nav-dashboard"
              asChild
            >
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/about" data-testid="link-about" className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    About Website
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" data-testid="link-settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    sessionStorage.removeItem("connectaid_splash_seen");
                    window.location.reload();
                  }}
                  data-testid="button-replay-intro"
                  className="flex items-center"
                >
                  Replay Intro Animation
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("connectaid_user");
                    localStorage.removeItem("connectaid_alerts");
                    sessionStorage.clear();
                    window.location.href = "/login";
                  }}
                  data-testid="button-logout"
                  className="flex items-center text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
