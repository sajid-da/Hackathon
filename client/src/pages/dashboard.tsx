import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  AlertTriangle,
  Heart,
  Shield,
  Brain,
  MapPin,
  Clock,
  Users,
  Activity,
} from "lucide-react";
import type { Alert } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/alerts");
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
          localStorage.setItem("connectaid_alerts", JSON.stringify(data));
        } else {
          const storedAlerts = localStorage.getItem("connectaid_alerts");
          if (storedAlerts) {
            setAlerts(JSON.parse(storedAlerts));
          }
        }
      } catch (error) {
        const storedAlerts = localStorage.getItem("connectaid_alerts");
        if (storedAlerts) {
          setAlerts(JSON.parse(storedAlerts));
        }
      }
    };

    fetchAlerts();
  }, []);

  const filteredAlerts =
    filter === "all"
      ? alerts
      : alerts.filter((alert) => alert.category === filter);

  const stats = {
    total: alerts.length,
    medical: alerts.filter((a) => a.category === "medical").length,
    police: alerts.filter((a) => a.category === "police").length,
    mental: alerts.filter((a) => a.category === "mental_health").length,
    disaster: alerts.filter((a) => a.category === "disaster").length,
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "medical":
        return <Heart className="w-5 h-5" />;
      case "police":
        return <Shield className="w-5 h-5" />;
      case "mental_health":
        return <Brain className="w-5 h-5" />;
      case "disaster":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Control Panel</h1>
          <div className="w-24" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-6 hover-elevate">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-primary" />
              <Badge variant="outline" data-testid="badge-total-alerts">
                Live
              </Badge>
            </div>
            <p className="text-3xl font-bold mb-1">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Alerts</p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 text-medical" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.medical}</p>
            <p className="text-sm text-muted-foreground">Medical</p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-police" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.police}</p>
            <p className="text-sm text-muted-foreground">Police</p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-8 h-8 text-mental" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.mental}</p>
            <p className="text-sm text-muted-foreground">Mental Health</p>
          </Card>

          <Card className="p-6 hover-elevate">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-disaster" />
            </div>
            <p className="text-3xl font-bold mb-1">{stats.disaster}</p>
            <p className="text-sm text-muted-foreground">Disaster</p>
          </Card>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" data-testid="tab-all">
              All
            </TabsTrigger>
            <TabsTrigger value="medical" data-testid="tab-medical">
              Medical
            </TabsTrigger>
            <TabsTrigger value="police" data-testid="tab-police">
              Police
            </TabsTrigger>
            <TabsTrigger value="mental_health" data-testid="tab-mental">
              Mental Health
            </TabsTrigger>
            <TabsTrigger value="disaster" data-testid="tab-disaster">
              Disaster
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Alerts</h3>
                  <p className="text-muted-foreground">
                    {filter === "all"
                      ? "No emergency alerts have been created yet"
                      : `No ${filter.replace("_", " ")} alerts found`}
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 hover-elevate h-full">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(alert.category)}
                            <Badge
                              className={getCategoryColor(alert.category)}
                              data-testid={`badge-alert-category-${index}`}
                            >
                              {alert.category.replace("_", " ")}
                            </Badge>
                          </div>
                          <Badge
                            variant={
                              alert.status === "active" ? "default" : "outline"
                            }
                            data-testid={`badge-alert-status-${index}`}
                          >
                            {alert.status}
                          </Badge>
                        </div>

                        <div>
                          <p className="text-sm line-clamp-3 mb-3">
                            {alert.message}
                          </p>

                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(alert.createdAt).toLocaleString()}
                              </span>
                            </div>

                            {alert.location?.address && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                <span className="line-clamp-1">
                                  {alert.location.address}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Users className="w-3 h-3" />
                              <span>
                                {alert.responders?.length || 0} responders
                                assigned
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            data-testid={`button-view-details-${index}`}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
