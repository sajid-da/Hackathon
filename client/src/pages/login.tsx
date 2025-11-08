import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Heart, Shield, Phone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("connectaid_user");
    if (storedUser) {
      setLocation("/");
    }
  }, [setLocation]);

  const createUserMutation = useMutation({
    mutationFn: async (userData: { name: string; phone: string; email?: string }) => {
      const response = await apiRequest("POST", "/api/users", userData);
      return await response.json();
    },
    onSuccess: (user) => {
      localStorage.setItem("connectaid_user", JSON.stringify(user));
      toast({
        title: "Welcome to ConnectAid AI",
        description: "Your account has been created successfully",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name and phone number",
        variant: "destructive",
      });
      return;
    }

    createUserMutation.mutate({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical via-police to-mental flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-card/95 backdrop-blur-lg border-card-border shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-medical/20 mb-4"
            >
              <Heart className="w-10 h-10 text-medical" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to ConnectAid AI
            </h1>
            <p className="text-muted-foreground">
              Emergency response platform powered by AI
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-name"
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                data-testid="input-phone"
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
                className="bg-background"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-medical hover:bg-medical/90 min-h-12"
              disabled={createUserMutation.isPending}
              data-testid="button-login"
            >
              {createUserMutation.isPending ? (
                "Creating Account..."
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Get Started
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-medical mt-1 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Emergency?</strong> Call 911
                immediately if you're in immediate danger.
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center text-white/80 text-sm">
          <p>By using ConnectAid AI, you agree to our ethical AI principles</p>
          <p className="mt-2">
            Your data is secure and will only be used for emergency response
          </p>
        </div>
      </motion.div>
    </div>
  );
}
